// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Get current user info from token
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ username: decoded.username });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      wallet: user.wallet,
      joinedAt: user.createdAt,
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

module.exports = router;
