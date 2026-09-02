const asyncHandler = require('express-async-handler');
const Hostel = require('../models/Hostel');

/** @route GET /api/insights/summary */
const getSummary = asyncHandler(async (req, res) => {
  const [summary] = await Hostel.aggregate([
    {
      $group: {
        _id: null,
        avgRent: { $avg: '$price' },
        avgRating: { $avg: '$rating' },
        avgDistance: { $avg: '$distanceKm' },
        available: { $sum: { $cond: [{ $ne: ['$availability', 'full'] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    summary: summary
      ? {
          avgRent: Math.round(summary.avgRent),
          avgRating: Math.round(summary.avgRating * 10) / 10,
          avgDistance: Math.round(summary.avgDistance * 10) / 10,
          availableHostels: summary.available,
          totalHostels: summary.total,
        }
      : { avgRent: 0, avgRating: 0, avgDistance: 0, availableHostels: 0, totalHostels: 0 },
  });
});

/** @route GET /api/insights/rent-by-area */
const getRentByArea = asyncHandler(async (req, res) => {
  const data = await Hostel.aggregate([
    { $group: { _id: '$locality', avgRent: { $avg: '$price' }, count: { $sum: 1 } } },
    { $project: { _id: 0, locality: '$_id', avgRent: { $round: ['$avgRent', 0] }, count: 1 } },
    { $sort: { avgRent: -1 } },
    { $limit: 12 },
  ]);
  res.json({ success: true, data });
});

/** @route GET /api/insights/rating-distribution */
const getRatingDistribution = asyncHandler(async (req, res) => {
  const data = await Hostel.aggregate([
    { $bucket: { groupBy: '$rating', boundaries: [0, 3, 4, 4.5, 5.1], default: 'other', output: { count: { $sum: 1 } } } },
  ]);
  res.json({ success: true, data });
});

/** @route GET /api/insights/facility-availability */
const getFacilityAvailability = asyncHandler(async (req, res) => {
  const total = await Hostel.countDocuments();
  const data = await Hostel.aggregate([
    { $unwind: '$facilities' },
    { $group: { _id: '$facilities', count: { $sum: 1 } } },
    { $project: { _id: 0, facility: '$_id', count: 1, pct: { $round: [{ $multiply: [{ $divide: ['$count', total || 1] }, 100] }, 0] } } },
    { $sort: { count: -1 } },
  ]);
  res.json({ success: true, data });
});

/** @route GET /api/insights/city/:city */
const getCityInsights = asyncHandler(async (req, res) => {
  const city = req.params.city;
  const [summary] = await Hostel.aggregate([
    { $match: { city } },
    {
      $group: {
        _id: null,
        avgRent: { $avg: '$price' },
        avgRating: { $avg: '$rating' },
        avgSafety: { $avg: '$safetyScore' },
        wifiCount: { $sum: { $cond: [{ $in: ['wifi', '$facilities'] }, 1, 0] } },
        acCount: { $sum: { $cond: [{ $in: ['ac', '$facilities'] }, 1, 0] } },
        foodCount: { $sum: { $cond: ['$food.included', 1, 0] } },
        total: { $sum: 1 },
      },
    },
  ]);

  if (!summary) {
    return res.json({ success: true, city, summary: null });
  }

  res.json({
    success: true,
    city,
    summary: {
      hostelCount: summary.total,
      avgRent: Math.round(summary.avgRent),
      avgRating: Math.round(summary.avgRating * 10) / 10,
      avgSafety: Math.round(summary.avgSafety),
      wifiPct: Math.round((summary.wifiCount / summary.total) * 100),
      acPct: Math.round((summary.acCount / summary.total) * 100),
      foodPct: Math.round((summary.foodCount / summary.total) * 100),
    },
  });
});

module.exports = { getSummary, getRentByArea, getRatingDistribution, getFacilityAvailability, getCityInsights };
