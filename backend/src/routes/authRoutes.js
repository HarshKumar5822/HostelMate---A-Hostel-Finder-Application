const express = require('express');
const {
  registerUser, loginUser, getMe, updatePreferences, registerOwner, loginOwner,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);

router.post('/owner/register', registerOwner);
router.post('/owner/login', loginOwner);

module.exports = router;
