require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const PhoneNumber = require('./models/PhoneNumber');
const PortingRequest = require('./models/PortingRequest');
const FraudAlert = require('./models/FraudAlert');
const AuditLog = require('./models/AuditLog');

const carriers = ['AT&T', 'Verizon', 'T-Mobile', 'Sprint', 'US Cellular', 'MetroPCS'];
const types = ['local', 'toll-free', 'mobile', 'voip'];
const statuses = ['available', 'assigned', 'porting', 'suspended'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateNumber = (areaCode) => {
  const mid = String(Math.floor(Math.random() * 900) + 100);
  const end = String(Math.floor(Math.random() * 9000) + 1000);
  return `+1${areaCode}${mid}${end}`;
};

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    PhoneNumber.deleteMany(),
    PortingRequest.deleteMany(),
    FraudAlert.deleteMany(),
    AuditLog.deleteMany(),
  ]);

  // Users
  console.log('Creating users...');
  const adminPassword = 'admin1234';
  const operatorPassword = 'operator1234';

  const admin = await User.create({ name: 'Admin User', email: 'admin@telcoguard.com', password: adminPassword, role: 'admin' });
  const operator = await User.create({ name: 'Operator User', email: 'operator@telcoguard.com', password: operatorPassword, role: 'operator' });

  console.log('\n=== Seed Credentials ===');
  console.log(`Admin    → email: admin@telcoguard.com    | password: ${adminPassword}`);
  console.log(`Operator → email: operator@telcoguard.com | password: ${operatorPassword}`);
  console.log('========================\n');

  // Phone numbers
  console.log('Creating phone numbers...');
  const areaCodes = ['202', '212', '312', '415', '512', '617', '702', '800', '900', '976', '242', '809'];
  const phones = [];
  for (let i = 0; i < 50; i++) {
    const areaCode = areaCodes[i % areaCodes.length];
    try {
      const phone = await PhoneNumber.create({
        number: generateNumber(areaCode),
        type: randomFrom(types),
        status: randomFrom(statuses),
        carrier: randomFrom(carriers),
        assignedTo: Math.random() > 0.5 ? `customer-${String(i + 1).padStart(3, '0')}` : undefined,
      });
      phones.push(phone);
    } catch (e) {
      // skip duplicates
    }
  }

  // Porting requests
  console.log('Creating porting requests...');
  const portingStatuses = ['pending', 'pending', 'pending', 'approved', 'rejected', 'completed', 'flagged', 'flagged', 'pending', 'completed'];
  const portings = [];
  for (let i = 0; i < 10; i++) {
    const phone = phones[i];
    if (!phone) continue;
    const fromCarrier = randomFrom(carriers);
    const toCarrier = randomFrom(carriers.filter((c) => c !== fromCarrier));
    const pr = await PortingRequest.create({
      phoneNumber: phone._id,
      requestedBy: i % 3 === 0 ? admin._id : operator._id,
      fromCarrier,
      toCarrier,
      status: portingStatuses[i],
      flagged: portingStatuses[i] === 'flagged',
      flagReason: portingStatuses[i] === 'flagged' ? 'rapid-port, known-fraud-area' : undefined,
      requestedAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000),
    });
    portings.push(pr);
  }

  // Fraud alerts
  console.log('Creating fraud alerts...');
  const flaggedPortings = portings.filter((p) => p.flagged);
  const alertTypes = ['rapid-port', 'known-fraud-area', 'multiple-requests'];
  for (let i = 0; i < Math.min(3, flaggedPortings.length); i++) {
    await FraudAlert.create({
      portingRequest: flaggedPortings[i]._id,
      alertType: alertTypes[i % alertTypes.length],
      severity: i === 0 ? 'high' : 'medium',
      description: `Automated detection: ${alertTypes[i % alertTypes.length]}`,
      resolved: i === 2,
      resolvedBy: i === 2 ? admin._id : undefined,
      resolvedAt: i === 2 ? new Date() : undefined,
    });
  }

  // Audit logs
  console.log('Creating audit logs...');
  const actions = ['NUMBER_PROVISIONED', 'NUMBER_UPDATED', 'NUMBER_STATUS_CHANGED', 'PORT_REQUESTED', 'PORT_APPROVED', 'PORT_REJECTED', 'FRAUD_RESOLVED'];
  for (let i = 0; i < 20; i++) {
    await AuditLog.create({
      action: actions[i % actions.length],
      user: i % 2 === 0 ? admin._id : operator._id,
      targetType: i < 10 ? 'PhoneNumber' : 'PortingRequest',
      targetId: i < 10 ? phones[i % phones.length]?._id : portings[i % portings.length]?._id,
      details: { note: `Seed entry ${i + 1}` },
      ipAddress: '127.0.0.1',
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
    });
  }

  console.log('Seed complete.');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
