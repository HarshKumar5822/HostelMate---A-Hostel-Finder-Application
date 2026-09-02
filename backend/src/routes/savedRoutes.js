const express = require('express');
const { getSavedHostels, saveHostel } = require('../controllers/savedController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getSavedHostels);
router.post('/:hostelId', saveHostel);

module.exports = router;
