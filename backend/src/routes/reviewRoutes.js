const express = require('express');
const { respondToReview } = require('../controllers/reviewController');
const { protect, ownerOnly } = require('../middleware/auth');

const router = express.Router();

router.put('/:id/response', protect, ownerOnly, respondToReview);

module.exports = router;
