const PhoneNumber = require('../models/PhoneNumber');
const { paginate, formatResponse } = require('../utils/helpers');
const { logAudit } = require('../services/auditService');

const listPhones = async (req, res, next) => {
  try {
    const { page, limit, status, type, areaCode, search } = req.query;
    const { skip, limit: l, page: p } = paginate(page, limit);
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (areaCode) filter.areaCode = areaCode;
    if (search) {
      filter.$or = [
        { number: { $regex: search, $options: 'i' } },
        { carrier: { $regex: search, $options: 'i' } },
        { assignedTo: { $regex: search, $options: 'i' } },
      ];
    }
    const [phones, total] = await Promise.all([
      PhoneNumber.find(filter).skip(skip).limit(l).sort({ createdAt: -1 }),
      PhoneNumber.countDocuments(filter),
    ]);
    res.json(formatResponse(true, { phones, totalCount: total, page: p, limit: l, totalPages: Math.ceil(total / l) }, ''));
  } catch (err) {
    next(err);
  }
};

const getPhone = async (req, res, next) => {
  try {
    const phone = await PhoneNumber.findById(req.params.id);
    if (!phone) return res.status(404).json(formatResponse(false, null, 'Phone number not found'));
    res.json(formatResponse(true, phone, ''));
  } catch (err) {
    next(err);
  }
};

const createPhone = async (req, res, next) => {
  try {
    const phone = await PhoneNumber.create(req.body);
    await logAudit('NUMBER_PROVISIONED', req.user._id, 'PhoneNumber', phone._id, { number: phone.number }, req.ip);
    res.status(201).json(formatResponse(true, phone, 'Phone number created'));
  } catch (err) {
    next(err);
  }
};

const updatePhone = async (req, res, next) => {
  try {
    const phone = await PhoneNumber.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!phone) return res.status(404).json(formatResponse(false, null, 'Phone number not found'));
    await logAudit('NUMBER_UPDATED', req.user._id, 'PhoneNumber', phone._id, req.body, req.ip);
    res.json(formatResponse(true, phone, 'Phone number updated'));
  } catch (err) {
    next(err);
  }
};

const deletePhone = async (req, res, next) => {
  try {
    const phone = await PhoneNumber.findByIdAndDelete(req.params.id);
    if (!phone) return res.status(404).json(formatResponse(false, null, 'Phone number not found'));
    res.json(formatResponse(true, null, 'Phone number deleted'));
  } catch (err) {
    next(err);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const phone = await PhoneNumber.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!phone) return res.status(404).json(formatResponse(false, null, 'Phone number not found'));
    await logAudit('NUMBER_STATUS_CHANGED', req.user._id, 'PhoneNumber', phone._id, { status }, req.ip);
    res.json(formatResponse(true, phone, 'Status updated'));
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await PhoneNumber.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const typeStats = await PhoneNumber.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);
    const total = await PhoneNumber.countDocuments();
    res.json(formatResponse(true, { total, byStatus: stats, byType: typeStats }, ''));
  } catch (err) {
    next(err);
  }
};

module.exports = { listPhones, getPhone, createPhone, updatePhone, deletePhone, changeStatus, getStats };
