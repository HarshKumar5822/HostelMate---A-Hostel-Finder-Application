const express = require('express');
const {
  getMyHostels, getOwnerAnalytics, getOwnerInquiries, updateInquiryStatus,
} = require('../controllers/ownerController');
const { protect, ownerOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, ownerOnly);

router.get('/hostels', getMyHostels);
router.get('/analytics', getOwnerAnalytics);
router.get('/inquiries', getOwnerInquiries);
router.put('/inquiries/:id', updateInquiryStatus);

module.exports = router;
