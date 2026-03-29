const FraudAlert = require('../models/FraudAlert');
const { logAudit } = require('../services/auditService');
const { paginate, formatResponse } = require('../utils/helpers');

const listFraud = async (req, res, next) => {
  try {
    const { page, limit, severity, alertType, resolved } = req.query;
    const { skip, limit: l, page: p } = paginate(page, limit);
    const filter = {};
    if (severity) filter.severity = severity;
    if (alertType) filter.alertType = alertType;
    if (resolved !== undefined) filter.resolved = resolved === 'true';
    const [alerts, total] = await Promise.all([
      FraudAlert.find(filter)
        .populate('portingRequest')
        .populate('resolvedBy', 'name email')
        .skip(skip).limit(l).sort({ createdAt: -1 }),
      FraudAlert.countDocuments(filter),
    ]);
    res.json(formatResponse(true, { alerts, totalCount: total, page: p, limit: l, totalPages: Math.ceil(total / l) }, ''));
  } catch (err) {
    next(err);
  }
};

const getFraud = async (req, res, next) => {
  try {
    const alert = await FraudAlert.findById(req.params.id)
      .populate('portingRequest')
      .populate('resolvedBy', 'name email');
    if (!alert) return res.status(404).json(formatResponse(false, null, 'Fraud alert not found'));
    res.json(formatResponse(true, alert, ''));
  } catch (err) {
    next(err);
  }
};

const resolveFraud = async (req, res, next) => {
  try {
    const alert = await FraudAlert.findById(req.params.id);
    if (!alert) return res.status(404).json(formatResponse(false, null, 'Fraud alert not found'));
    if (alert.resolved) return res.status(400).json(formatResponse(false, null, 'Alert already resolved'));

    alert.resolved = true;
    alert.resolvedBy = req.user._id;
    alert.resolvedAt = new Date();
    alert.resolutionNotes = req.body.resolutionNotes || '';
    await alert.save();

    await logAudit('FRAUD_RESOLVED', req.user._id, 'FraudAlert', alert._id, { resolutionNotes: alert.resolutionNotes }, req.ip);
    res.json(formatResponse(true, alert, 'Alert resolved'));
  } catch (err) {
    next(err);
  }
};

const getFraudStats = async (req, res, next) => {
  try {
    const [bySeverity, byType, total, unresolved] = await Promise.all([
      FraudAlert.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
      FraudAlert.aggregate([{ $group: { _id: '$alertType', count: { $sum: 1 } } }]),
      FraudAlert.countDocuments(),
      FraudAlert.countDocuments({ resolved: false }),
    ]);
    res.json(formatResponse(true, { total, unresolved, bySeverity, byType }, ''));
  } catch (err) {
    next(err);
  }
};

module.exports = { listFraud, getFraud, resolveFraud, getFraudStats };
