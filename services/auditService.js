const AuditLog = require('../models/AuditLog');

const logAudit = async (action, userId, targetType, targetId, details, ipAddress) => {
  try {
    await AuditLog.create({ action, user: userId, targetType, targetId, details, ipAddress });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};

module.exports = { logAudit };
