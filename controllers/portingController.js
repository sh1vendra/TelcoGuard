const PortingRequest = require('../models/PortingRequest');
const PhoneNumber = require('../models/PhoneNumber');
const { detectFraud } = require('../services/fraudDetectionService');
const { logAudit } = require('../services/auditService');
const { paginate, formatResponse } = require('../utils/helpers');

const listPorting = async (req, res, next) => {
  try {
    const { page, limit, status, flagged } = req.query;
    const { skip, limit: l, page: p } = paginate(page, limit);
    const filter = {};
    if (status) filter.status = status;
    if (flagged !== undefined) filter.flagged = flagged === 'true';
    const [requests, total] = await Promise.all([
      PortingRequest.find(filter)
        .populate('phoneNumber', 'number areaCode carrier')
        .populate('requestedBy', 'name email')
        .skip(skip).limit(l).sort({ requestedAt: -1 }),
      PortingRequest.countDocuments(filter),
    ]);
    res.json(formatResponse(true, { requests, totalCount: total, page: p, limit: l, totalPages: Math.ceil(total / l) }, ''));
  } catch (err) {
    next(err);
  }
};

const getPorting = async (req, res, next) => {
  try {
    const request = await PortingRequest.findById(req.params.id)
      .populate('phoneNumber')
      .populate('requestedBy', 'name email')
      .populate('resolvedBy', 'name email');
    if (!request) return res.status(404).json(formatResponse(false, null, 'Porting request not found'));
    res.json(formatResponse(true, request, ''));
  } catch (err) {
    next(err);
  }
};

const createPorting = async (req, res, next) => {
  try {
    const { phoneNumber, fromCarrier, toCarrier, notes } = req.body;
    const phone = await PhoneNumber.findById(phoneNumber);
    if (!phone) return res.status(404).json(formatResponse(false, null, 'Phone number not found'));

    const portingRequest = await PortingRequest.create({
      phoneNumber,
      requestedBy: req.user._id,
      fromCarrier,
      toCarrier,
      notes,
    });

    phone.status = 'porting';
    await phone.save();

    await detectFraud(portingRequest);
    await logAudit('PORT_REQUESTED', req.user._id, 'PortingRequest', portingRequest._id, { phoneNumber, fromCarrier, toCarrier }, req.ip);

    const populated = await PortingRequest.findById(portingRequest._id)
      .populate('phoneNumber', 'number areaCode carrier')
      .populate('requestedBy', 'name email');

    res.status(201).json(formatResponse(true, populated, 'Porting request created'));
  } catch (err) {
    next(err);
  }
};

const approvePorting = async (req, res, next) => {
  try {
    const portingRequest = await PortingRequest.findById(req.params.id);
    if (!portingRequest) return res.status(404).json(formatResponse(false, null, 'Porting request not found'));
    if (portingRequest.status !== 'pending' && portingRequest.status !== 'flagged') {
      return res.status(400).json(formatResponse(false, null, 'Only pending or flagged requests can be approved'));
    }

    portingRequest.status = 'completed';
    portingRequest.resolvedBy = req.user._id;
    portingRequest.resolvedAt = new Date();
    await portingRequest.save();

    await PhoneNumber.findByIdAndUpdate(portingRequest.phoneNumber, {
      carrier: portingRequest.toCarrier,
      status: 'assigned',
    });

    await logAudit('PORT_APPROVED', req.user._id, 'PortingRequest', portingRequest._id, {}, req.ip);
    res.json(formatResponse(true, portingRequest, 'Porting request approved'));
  } catch (err) {
    next(err);
  }
};

const rejectPorting = async (req, res, next) => {
  try {
    const portingRequest = await PortingRequest.findById(req.params.id);
    if (!portingRequest) return res.status(404).json(formatResponse(false, null, 'Porting request not found'));
    if (portingRequest.status !== 'pending' && portingRequest.status !== 'flagged') {
      return res.status(400).json(formatResponse(false, null, 'Only pending or flagged requests can be rejected'));
    }

    portingRequest.status = 'rejected';
    portingRequest.resolvedBy = req.user._id;
    portingRequest.resolvedAt = new Date();
    if (req.body.notes) portingRequest.notes = req.body.notes;
    await portingRequest.save();

    await PhoneNumber.findByIdAndUpdate(portingRequest.phoneNumber, { status: 'assigned' });

    await logAudit('PORT_REJECTED', req.user._id, 'PortingRequest', portingRequest._id, { reason: req.body.notes }, req.ip);
    res.json(formatResponse(true, portingRequest, 'Porting request rejected'));
  } catch (err) {
    next(err);
  }
};

module.exports = { listPorting, getPorting, createPorting, approvePorting, rejectPorting };
