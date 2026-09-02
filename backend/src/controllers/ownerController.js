const asyncHandler = require('express-async-handler');
const Hostel = require('../models/Hostel');
const Inquiry = require('../models/Inquiry');

/** @route GET /api/owner/hostels */
const getMyHostels = asyncHandler(async (req, res) => {
  const hostels = await Hostel.find({ owner: req.owner._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: hostels.length, hostels });
});

/** @route GET /api/owner/analytics */
const getOwnerAnalytics = asyncHandler(async (req, res) => {
  const hostels = await Hostel.find({ owner: req.owner._id });
  const hostelIds = hostels.map((h) => h._id);

  const totals = hostels.reduce(
    (acc, h) => ({
      profileViews: acc.profileViews + (h.stats?.profileViews || 0),
      searchImpressions: acc.searchImpressions + (h.stats?.searchImpressions || 0),
      savedCount: acc.savedCount + (h.stats?.savedCount || 0),
      inquiries: acc.inquiries + (h.stats?.inquiries || 0),
    }),
    { profileViews: 0, searchImpressions: 0, savedCount: 0, inquiries: 0 }
  );

  const conversionRate = totals.profileViews > 0
    ? Math.round((totals.inquiries / totals.profileViews) * 1000) / 10
    : 0;

  const inquiriesBySource = await Inquiry.aggregate([
    { $match: { hostel: { $in: hostelIds } } },
    { $group: { _id: '$source', count: { $sum: 1 } } },
  ]);

  res.json({ success: true, totals: { ...totals, conversionRate }, inquiriesBySource });
});

/** @route GET /api/owner/inquiries */
const getOwnerInquiries = asyncHandler(async (req, res) => {
  const hostels = await Hostel.find({ owner: req.owner._id }).select('_id');
  const inquiries = await Inquiry.find({ hostel: { $in: hostels.map((h) => h._id) } })
    .populate('hostel', 'name city locality')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: inquiries.length, inquiries });
});

/** @route PUT /api/owner/inquiries/:id */
const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id).populate('hostel');
  if (!inquiry) { res.status(404); throw new Error('Inquiry not found'); }
  if (String(inquiry.hostel.owner) !== String(req.owner._id)) {
    res.status(403);
    throw new Error('Not your inquiry to manage');
  }
  inquiry.status = req.body.status;
  await inquiry.save();
  res.json({ success: true, inquiry });
});

module.exports = { getMyHostels, getOwnerAnalytics, getOwnerInquiries, updateInquiryStatus };
