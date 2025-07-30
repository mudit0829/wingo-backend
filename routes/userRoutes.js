const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticate = require('../middleware/authenticate');

// GET /api/users/wallet - Get wallet balance of authenticated user
router.get('/wallet', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ wallet: user.wallet });
  } catch (err) {
    console.error('Error fetching wallet:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/users/update-wallet - Add or subtract balance
router.post('/update-wallet', authenticate, async (req, res) => {
  try {
    const { amount } = req.body; // Can be + or -
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wallet += amount;
    await user.save();

    res.json({ message: 'Wallet updated successfully', wallet: user.wallet });
  } catch (err) {
    console.error('Error updating wallet:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
