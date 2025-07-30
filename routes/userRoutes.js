// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Wallet balance fetch route
router.get('/wallet/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ wallet: user.wallet });
  } catch (error) {
    console.error('Wallet fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
