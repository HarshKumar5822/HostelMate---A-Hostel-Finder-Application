const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Owner = require('../models/Owner');
const { generateToken } = require('../utils/generateToken');

/** @route POST /api/auth/register */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('An account with this email already exists'); }

  const user = await User.create({ name, email, password });
  res.status(201).json({
    success: true,
    token: generateToken(user._id, 'user'),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

/** @route POST /api/auth/login */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({
    success: true,
    token: generateToken(user._id, 'user'),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

/** @route GET /api/auth/me */
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

/** @route PUT /api/auth/preferences */
const updatePreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.preferences = { ...user.preferences.toObject(), ...req.body };
  await user.save();
  res.json({ success: true, preferences: user.preferences });
});

/** @route POST /api/auth/owner/register */
const registerOwner = asyncHandler(async (req, res) => {
  const { name, businessName, email, password, phone } = req.body;
  const exists = await Owner.findOne({ email });
  if (exists) { res.status(400); throw new Error('An owner account with this email already exists'); }

  const owner = await Owner.create({ name, businessName, email, password, phone });
  res.status(201).json({
    success: true,
    token: generateToken(owner._id, 'owner'),
    owner: { id: owner._id, name: owner.name, businessName: owner.businessName, email: owner.email },
  });
});

/** @route POST /api/auth/owner/login */
const loginOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const owner = await Owner.findOne({ email }).select('+password');
  if (!owner || !(await owner.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({
    success: true,
    token: generateToken(owner._id, 'owner'),
    owner: { id: owner._id, name: owner.name, businessName: owner.businessName, email: owner.email },
  });
});

module.exports = { registerUser, loginUser, getMe, updatePreferences, registerOwner, loginOwner };
