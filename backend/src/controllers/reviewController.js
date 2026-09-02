const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Hostel = require('../models/Hostel');

/** @route GET /api/hostels/:hostelId/reviews */
const getReviewsForHostel = asyncHandler(async (req, res) => {
  const { sort = 'recent' } = req.query;
  const sortMap = {
    recent: { createdAt: -1 },
    highestRated: { rating: -1 },
    lowestRated: { rating: 1 },
  };
  const reviews = await Review.find({ hostel: req.params.hostelId }).sort(sortMap[sort] || sortMap.recent);
  res.json({ success: true, count: reviews.length, reviews });
});

/** @route POST /api/hostels/:hostelId/reviews — logged-in user */
const createReview = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.hostelId);
  if (!hostel) { res.status(404); throw new Error('Hostel not found'); }

  const review = await Review.create({
    hostel: hostel._id,
    user: req.user?._id,
    name: req.user?.name || req.body.name || 'Anonymous',
    role: req.body.role || 'Student',
    rating: req.body.rating,
    text: req.body.text,
    categories: req.body.categories || {},
  });

  // Recalculate the hostel's aggregate rating.
  const agg = await Review.aggregate([
    { $match: { hostel: hostel._id } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (agg[0]) {
    hostel.rating = Math.round(agg[0].avg * 10) / 10;
    hostel.reviewCount = agg[0].count;
    await hostel.save();
  }

  res.status(201).json({ success: true, review });
});

/** @route POST /api/reviews/:id/response — owner replies to a review */
const respondToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  review.ownerResponse = req.body.response;
  await review.save();
  res.json({ success: true, review });
});

module.exports = { getReviewsForHostel, createReview, respondToReview };
