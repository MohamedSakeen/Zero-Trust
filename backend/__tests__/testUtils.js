const jwt = require('jsonwebtoken');

// Generate a test JWT for use in integration tests
function generateTestJWT() {
  const payload = { userId: 'test-user', role: 'candidate' };
  const secret = process.env.JWT_SECRET || 'zero-trust-jwt';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

module.exports = { generateTestJWT };
