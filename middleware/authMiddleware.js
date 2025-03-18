// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;  // Store admin data in request object
    next();  // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = protect;
