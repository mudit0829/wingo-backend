const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get wallet balance by username
router.get('/wallet/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update wallet by username
router.post('/update-wallet', async (req, res) => {
  const { username, amount } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.wallet += amount;
    await user.save();
    res.json({ message: 'Wallet updated', wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
