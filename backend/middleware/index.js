// (Optional) Add authentication, rate limiting, or logging middleware here for production use.
const jwt = require('jsonwebtoken');

// JWT authentication middleware
function authenticateJWT(req, res, next) {
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.JWT_SECRET || 'zero-trust-jwt', (err, user) => {
			if (err) {
				return res.status(403).json({ success: false, error: 'Invalid or expired token' });
			}
			req.user = user;
			next();
		});
	} else {
		res.status(401).json({ success: false, error: 'No token provided' });
	}
}

module.exports = {
	authenticateJWT,
};
