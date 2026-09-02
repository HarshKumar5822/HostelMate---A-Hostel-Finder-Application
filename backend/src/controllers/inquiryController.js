const asyncHandler = require('express-async-handler');
const Inquiry = require('../models/Inquiry');
const Hostel = require('../models/Hostel');

/** @route POST /api/hostels/:hostelId/inquiries */
const createInquiry = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.hostelId);
  if (!hostel) { res.status(404); throw new Error('Hostel not found'); }

  const inquiry = await Inquiry.create({
    hostel: hostel._id,
    user: req.user?._id,
    name: req.body.name,
    phone: req.body.phone,
    message: req.body.message,
    source: req.body.source || 'direct',
  });

  hostel.stats.inquiries += 1;
  await hostel.save();

  res.status(201).json({ success: true, inquiry });
});

module.exports = { createInquiry };
