const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET wallet balance by email
router.get('/wallet/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST update wallet
router.post('/update-wallet', async (req, res) => {
  const { email, amount } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.balance += amount;
    await user.save();
    res.json({ message: 'Wallet updated', newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
