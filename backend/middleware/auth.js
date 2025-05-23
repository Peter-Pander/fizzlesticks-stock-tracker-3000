// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token   = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;          // attach only when truthy
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export default requireAuth;
