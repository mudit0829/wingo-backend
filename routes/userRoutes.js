// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get Wallet Balance
router.get('/wallet/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Wallet (Add or Deduct amount)
router.post('/update-wallet', async (req, res) => {
  try {
    const { username, amount } = req.body;
    if (!username || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wallet += amount;
    await user.save();

    res.json({ wallet: user.wallet, message: 'Wallet updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
