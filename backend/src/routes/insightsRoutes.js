const express = require('express');
const {
  getSummary, getRentByArea, getRatingDistribution, getFacilityAvailability, getCityInsights,
} = require('../controllers/insightsController');

const router = express.Router();

router.get('/summary', getSummary);
router.get('/rent-by-area', getRentByArea);
router.get('/rating-distribution', getRatingDistribution);
router.get('/facility-availability', getFacilityAvailability);
router.get('/city/:city', getCityInsights);

module.exports = router;
