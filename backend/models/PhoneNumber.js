const mongoose = require('mongoose');

const PhoneNumberSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true, trim: true },
  areaCode: { type: String },
  type: { type: String, enum: ['local', 'toll-free', 'mobile', 'voip'], default: 'local' },
  status: {
    type: String,
    enum: ['available', 'assigned', 'porting', 'suspended', 'flagged'],
    default: 'available',
  },
  carrier: { type: String, trim: true },
  assignedTo: { type: String, trim: true },
  notes: { type: String },
}, { timestamps: true });

PhoneNumberSchema.index({ areaCode: 1 });
PhoneNumberSchema.index({ status: 1 });

PhoneNumberSchema.pre('save', function (next) {
  if (this.isModified('number')) {
    const digits = this.number.replace(/\D/g, '');
    if (digits.length === 11 && digits[0] === '1') {
      this.areaCode = digits.substring(1, 4);
    } else if (digits.length === 10) {
      this.areaCode = digits.substring(0, 3);
    }
  }
  next();
});

module.exports = mongoose.model('PhoneNumber', PhoneNumberSchema);
