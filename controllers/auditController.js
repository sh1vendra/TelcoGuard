const AuditLog = require('../models/AuditLog');
const { paginate, formatResponse } = require('../utils/helpers');

const listAudit = async (req, res, next) => {
  try {
    const { page, limit, action, userId } = req.query;
    const { skip, limit: l, page: p } = paginate(page, limit);
    const filter = {};
    if (action) filter.action = action;
    if (userId) filter.user = userId;
    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate('user', 'name email')
        .skip(skip).limit(l).sort({ timestamp: -1 }),
      AuditLog.countDocuments(filter),
    ]);
    res.json(formatResponse(true, { logs, totalCount: total, page: p, limit: l, totalPages: Math.ceil(total / l) }, ''));
  } catch (err) {
    next(err);
  }
};

module.exports = { listAudit };
