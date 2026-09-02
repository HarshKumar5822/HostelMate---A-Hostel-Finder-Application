const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    role: { type: String, enum: ['Student', 'Professional'], default: 'Student' },
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, required: true, trim: true },
    categories: {
      cleanliness: { type: Number, min: 1, max: 5 },
      food: { type: Number, min: 1, max: 5 },
      location: { type: Number, min: 1, max: 5 },
      safety: { type: Number, min: 1, max: 5 },
      staff: { type: Number, min: 1, max: 5 },
      value: { type: Number, min: 1, max: 5 },
    },
    ownerResponse: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
