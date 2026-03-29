const mongoose = require('mongoose');

const PortingRequestSchema = new mongoose.Schema({
  phoneNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'PhoneNumber', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromCarrier: { type: String, required: true, trim: true },
  toCarrier: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'flagged'],
    default: 'pending',
  },
  flagged: { type: Boolean, default: false },
  flagReason: { type: String },
  requestedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('PortingRequest', PortingRequestSchema);
