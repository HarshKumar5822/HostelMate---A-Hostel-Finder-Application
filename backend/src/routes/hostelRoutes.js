const express = require('express');
const {
  getHostels, getHostelById, createHostel, updateHostel, deleteHostel,
  getMatchScore, getAnalysis, nlpSearch,
} = require('../controllers/hostelController');
const { getReviewsForHostel, createReview } = require('../controllers/reviewController');
const { createInquiry } = require('../controllers/inquiryController');
const { protect, ownerOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/nlp-search', nlpSearch);

router.route('/')
  .get(getHostels)
  .post(protect, ownerOnly, createHostel);

router.route('/:id')
  .get(getHostelById)
  .put(protect, ownerOnly, updateHostel)
  .delete(protect, ownerOnly, deleteHostel);

router.get('/:id/match', getMatchScore);
router.get('/:id/analysis', getAnalysis);

router.route('/:hostelId/reviews')
  .get(getReviewsForHostel)
  .post(protect, createReview);

router.post('/:hostelId/inquiries', createInquiry);

module.exports = router;
