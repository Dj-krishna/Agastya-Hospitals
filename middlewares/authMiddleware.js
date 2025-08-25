const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // userID, email, roleID, etc.
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
