
// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify JWT token (alias for authenticate)
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Token format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store decoded user info in request
    req.admin = decoded; // Also store as admin for backward compatibility
    next(); // Proceed to protected route
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Authorize based on user roles
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role || req.user.userRole;
    
    if (roles.length > 0 && !roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Alias for backward compatibility
const protect = authenticate;

const authMiddleware = {
  // Verify JWT token (backward compatibility)
  verifyToken: authenticate,
  // New exports
  authenticate,
  authorize,
  protect,
};

module.exports = authMiddleware;
module.exports.authenticate = authenticate;
module.exports.authorize = authorize;
module.exports.protect = protect;
