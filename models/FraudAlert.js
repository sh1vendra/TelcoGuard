const mongoose = require('mongoose');

const FraudAlertSchema = new mongoose.Schema({
  portingRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'PortingRequest', required: true },
  detectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  alertType: {
    type: String,
    enum: ['rapid-port', 'multiple-requests', 'known-fraud-area', 'manual'],
    required: true,
  },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  description: { type: String },
  resolved: { type: Boolean, default: false },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  resolutionNotes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('FraudAlert', FraudAlertSchema);
