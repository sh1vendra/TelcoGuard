const PortingRequest = require('../models/PortingRequest');
const FraudAlert = require('../models/FraudAlert');
const PhoneNumber = require('../models/PhoneNumber');

const FRAUD_AREA_CODES = ['900', '976', '242', '809', '284', '649'];

const detectFraud = async (portingRequest) => {
  const alerts = [];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Check 1: rapid port — same number ported within last 30 days
  const rapidPort = await PortingRequest.findOne({
    phoneNumber: portingRequest.phoneNumber,
    requestedAt: { $gte: thirtyDaysAgo },
    _id: { $ne: portingRequest._id },
  });
  if (rapidPort) {
    const alert = await FraudAlert.create({
      portingRequest: portingRequest._id,
      alertType: 'rapid-port',
      severity: 'high',
      description: 'Phone number ported within the last 30 days',
    });
    alerts.push(alert);
  }

  // Check 2: multiple pending requests from same carrier in last 7 days
  const pendingCount = await PortingRequest.countDocuments({
    fromCarrier: portingRequest.fromCarrier,
    status: 'pending',
    requestedAt: { $gte: sevenDaysAgo },
  });
  if (pendingCount >= 3) {
    const alert = await FraudAlert.create({
      portingRequest: portingRequest._id,
      alertType: 'multiple-requests',
      severity: 'medium',
      description: `${pendingCount} pending requests from ${portingRequest.fromCarrier} in last 7 days`,
    });
    alerts.push(alert);
  }

  // Check 3: known fraud area code
  const phone = await PhoneNumber.findById(portingRequest.phoneNumber);
  if (phone && FRAUD_AREA_CODES.includes(phone.areaCode)) {
    const alert = await FraudAlert.create({
      portingRequest: portingRequest._id,
      alertType: 'known-fraud-area',
      severity: 'medium',
      description: `Area code ${phone.areaCode} is flagged as high-risk`,
    });
    alerts.push(alert);
  }

  if (alerts.length > 0) {
    const flagReason = alerts.map((a) => a.alertType).join(', ');
    portingRequest.status = 'flagged';
    portingRequest.flagged = true;
    portingRequest.flagReason = flagReason;
    await portingRequest.save();
  }

  return alerts;
};

module.exports = { detectFraud };
