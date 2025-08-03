const express = require('express');
const router = express.Router();
const User = require('../models/user');

// ✅ Get user wallet by email
router.get('/wallet/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ wallet: user.wallet });
  } catch (err) {
    console.error('Fetch Wallet Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update user wallet balance by amount (+/-)
router.post('/wallet/update', async (req, res) => {
  try {
    const { email, amount } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wallet += amount;  // Can be positive (add) or negative (deduct)
    await user.save();

    res.json({ message: 'Wallet updated successfully', wallet: user.wallet });
  } catch (err) {
    console.error('Update Wallet Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
