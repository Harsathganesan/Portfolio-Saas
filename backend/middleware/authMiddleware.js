import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isInMemoryFallback } from '../config/db.js';
import { getJwtSecret } from '../utils/jwt.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (isInMemoryFallback) {
      req.user = {
        _id: decoded.id || 'mock_user_id',
        username: decoded.username || 'demo_user',
        email: decoded.email || 'user@example.com',
        role: decoded.role || 'user',
      };
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (user.isDisabled) {
      return res.status(403).json({ success: false, message: 'Account has been disabled' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
