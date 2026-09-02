const asyncHandler = require('express-async-handler');
const Hostel = require('../models/Hostel');
const { computeMatch } = require('../utils/matching');
const { analyzeHostel } = require('../utils/analyzer');

const SORT_MAP = {
  lowestPrice: { price: 1 },
  highestRated: { rating: -1 },
  nearest: { distanceKm: 1 },
  mostFacilities: {}, // handled in-memory below (array length can't be sorted natively)
  recentlyAdded: { createdAt: -1 },
  recommended: { rating: -1 },
};

/**
 * @route   GET /api/hostels
 * @desc    Search & filter hostels
 * @query   gender, location, budgetMin, budgetMax, roomTypes, facilities,
 *          foodOnly, vegOnly, sort, page, limit
 */
const getHostels = asyncHandler(async (req, res) => {
  const {
    gender, location, budgetMin, budgetMax, roomTypes, facilities,
    foodOnly, vegOnly, sort = 'recommended', page = 1, limit = 24,
  } = req.query;

  const query = {};
  if (gender) query.gender = gender;
  if (location) {
    const regex = new RegExp(location, 'i');
    query.$or = [{ city: regex }, { locality: regex }, { landmark: regex }];
  }
  if (budgetMin || budgetMax) {
    query.price = {};
    if (budgetMin) query.price.$gte = Number(budgetMin);
    if (budgetMax) query.price.$lte = Number(budgetMax);
  }
  if (roomTypes) {
    const types = Array.isArray(roomTypes) ? roomTypes : roomTypes.split(',');
    query['roomTypes.type'] = { $in: types };
  }
  if (facilities) {
    const list = Array.isArray(facilities) ? facilities : facilities.split(',');
    query.facilities = { $all: list };
  }
  if (foodOnly === 'true') query['food.included'] = true;
  if (vegOnly === 'true') { query['food.veg'] = true; query['food.nonVeg'] = false; }

  const sortSpec = SORT_MAP[sort] || SORT_MAP.recommended;
  const pageNum = Math.max(1, Number(page));
  const pageSize = Math.min(60, Number(limit));

  let cursor = Hostel.find(query).sort(sortSpec);

  if (sort === 'mostFacilities') {
    const all = await cursor;
    all.sort((a, b) => (b.facilities?.length || 0) - (a.facilities?.length || 0));
    const start = (pageNum - 1) * pageSize;
    return res.json({
      success: true,
      count: all.length,
      page: pageNum,
      results: all.slice(start, start + pageSize),
    });
  }

  const [results, count] = await Promise.all([
    cursor.skip((pageNum - 1) * pageSize).limit(pageSize),
    Hostel.countDocuments(query),
  ]);

  res.json({ success: true, count, page: pageNum, results });
});

/** @route GET /api/hostels/:id */
const getHostelById = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id).populate('owner', 'name businessName');
  if (!hostel) {
    res.status(404);
    throw new Error('Hostel not found');
  }
  // Track a profile view for owner analytics.
  hostel.stats.profileViews += 1;
  await hostel.save();
  res.json({ success: true, hostel });
});

/** @route POST /api/hostels — owner-only, creates a new listing */
const createHostel = asyncHandler(async (req, res) => {
  const hostel = await Hostel.create({ ...req.body, owner: req.owner._id });
  req.owner.hostels.push(hostel._id);
  await req.owner.save();
  res.status(201).json({ success: true, hostel });
});

/** @route PUT /api/hostels/:id — owner-only, must own the listing */
const updateHostel = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);
  if (!hostel) { res.status(404); throw new Error('Hostel not found'); }
  if (String(hostel.owner) !== String(req.owner._id)) {
    res.status(403);
    throw new Error('You do not own this listing');
  }
  Object.assign(hostel, req.body);
  await hostel.save();
  res.json({ success: true, hostel });
});

/** @route DELETE /api/hostels/:id — owner-only */
const deleteHostel = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);
  if (!hostel) { res.status(404); throw new Error('Hostel not found'); }
  if (String(hostel.owner) !== String(req.owner._id)) {
    res.status(403);
    throw new Error('You do not own this listing');
  }
  await hostel.deleteOne();
  res.json({ success: true, message: 'Hostel deleted' });
});

/** @route GET /api/hostels/:id/match — Smart Match score against query prefs */
const getMatchScore = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);
  if (!hostel) { res.status(404); throw new Error('Hostel not found'); }
  const prefs = {
    budgetMin: Number(req.query.budgetMin) || undefined,
    budgetMax: Number(req.query.budgetMax) || undefined,
    location: req.query.location,
    facilities: req.query.facilities ? req.query.facilities.split(',') : [],
    food: { included: req.query.foodIncluded === 'true', nonVeg: req.query.nonVeg === 'true' },
  };
  res.json({ success: true, match: computeMatch(hostel, prefs) });
});

/** @route GET /api/hostels/:id/analysis — Worth-It analyzer */
const getAnalysis = asyncHandler(async (req, res) => {
  const hostel = await Hostel.findById(req.params.id);
  if (!hostel) { res.status(404); throw new Error('Hostel not found'); }
  res.json({ success: true, analysis: analyzeHostel(hostel) });
});

/** @route GET /api/hostels/nlp-search?q=... — lightweight natural-language search */
const nlpSearch = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const query = {};

  if (q.includes('girl')) query.gender = 'girls';
  else if (q.includes('boy')) query.gender = 'boys';

  const budgetMatch = q.match(/(\d{3,6})/);
  if (budgetMatch) query.price = { $lte: Number(budgetMatch[1]) };

  if (q.includes('food')) query['food.included'] = true;
  if (q.includes('ac') && !q.includes('space')) query.facilities = 'ac';
  if (q.includes('wifi')) query.facilities = 'wifi';

  const stopWords = new Set(['girl', 'girls', 'boy', 'boys', 'hostel', 'hostels', 'under', 'food', 'wifi', 'with', 'near', 'best', 'good', 'room', 'rooms', 'than', 'from']);
  const locationWords = q.split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w));

  if (locationWords.length) {
    const locClauses = locationWords.flatMap((w) => [
      { city: new RegExp(w, 'i') },
      { locality: new RegExp(w, 'i') },
      { landmark: new RegExp(w, 'i') },
    ]);
    query.$or = locClauses;
  }

  const results = await Hostel.find(query).sort({ rating: -1 }).limit(20);
  res.json({ success: true, count: results.length, results });
});

module.exports = {
  getHostels, getHostelById, createHostel, updateHostel, deleteHostel,
  getMatchScore, getAnalysis, nlpSearch,
};
