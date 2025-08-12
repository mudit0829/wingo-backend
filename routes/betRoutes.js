// routes/betRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { placeBet, getAllBets } = require('../controllers/betController');
const router = express.Router();

// SIMPLE protect middleware (if you don't have middleware/authenticate.js)
async function protect(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
}

// Routes
router.post('/', protect, placeBet);
router.get('/user', protect, getAllBets);

module.exports = router;
