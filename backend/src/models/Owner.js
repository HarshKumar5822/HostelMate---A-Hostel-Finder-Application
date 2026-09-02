const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OwnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    businessName: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, default: '' },
    hostels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hostel' }],
  },
  { timestamps: true }
);

OwnerSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

OwnerSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Owner', OwnerSchema);
