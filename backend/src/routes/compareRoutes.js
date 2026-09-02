const express = require('express');
const asyncHandler = require('express-async-handler');
const Hostel = require('../models/Hostel');

const router = express.Router();

/** @route GET /api/compare?ids=id1,id2,id3 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const ids = (req.query.ids || '').split(',').filter(Boolean).slice(0, 4);
    if (ids.length < 2) {
      res.status(400);
      throw new Error('Provide at least 2 hostel ids to compare, e.g. ?ids=id1,id2');
    }
    const hostels = await Hostel.find({ _id: { $in: ids } });
    res.json({ success: true, count: hostels.length, hostels });
  })
);

module.exports = router;
