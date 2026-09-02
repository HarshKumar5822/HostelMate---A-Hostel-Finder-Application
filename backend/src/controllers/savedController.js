const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Hostel = require('../models/Hostel');

/** @route GET /api/saved */
const getSavedHostels = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedHostels');
  res.json({ success: true, count: user.savedHostels.length, hostels: user.savedHostels });
});

/** @route POST /api/saved/:hostelId */
const saveHostel = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const hostel = await Hostel.findById(req.params.hostelId);
  if (!hostel) { res.status(404); throw new Error('Hostel not found'); }

  const already = user.savedHostels.some((id) => String(id) === req.params.hostelId);
  if (already) {
    user.savedHostels = user.savedHostels.filter((id) => String(id) !== req.params.hostelId);
    hostel.stats.savedCount = Math.max(0, hostel.stats.savedCount - 1);
  } else {
    user.savedHostels.push(hostel._id);
    hostel.stats.savedCount += 1;
  }

  await Promise.all([user.save(), hostel.save()]);
  res.json({ success: true, saved: !already, savedHostels: user.savedHostels });
});

module.exports = { getSavedHostels, saveHostel };
