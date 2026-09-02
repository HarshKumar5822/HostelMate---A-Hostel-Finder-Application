const jwt = require('jsonwebtoken');

function generateToken(id, type = 'user') {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { generateToken };
