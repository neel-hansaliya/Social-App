import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware for Express routes
export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;       // full user object
    req.userId = user._id; // quick reference
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Utility function for socket.io
export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return null;
    return user;
  } catch (err) {
    return null;
  }
};
