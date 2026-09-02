const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Owner = require('../models/Owner');

/** Verifies a Bearer JWT and attaches the user/owner to req.user */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type === 'owner') {
      req.owner = await Owner.findById(decoded.id).select('-password');
      if (!req.owner) throw new Error();
    } else {
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) throw new Error();
    }
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized — invalid or expired token');
  }
});

/** Restricts a route to owner accounts only */
const ownerOnly = (req, res, next) => {
  if (!req.owner) {
    res.status(403);
    throw new Error('Owner access only');
  }
  next();
};

module.exports = { protect, ownerOnly };
