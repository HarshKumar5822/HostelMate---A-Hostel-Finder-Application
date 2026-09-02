const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: '' },
    source: {
      type: String,
      enum: ['discover', 'map', 'city', 'ai-assistant', 'direct'],
      default: 'direct',
    },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', InquirySchema);
