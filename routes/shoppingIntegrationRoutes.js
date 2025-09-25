const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  // update path if needed
const authenticateAdminOrShop = require('../middleware/authenticateAdminOrShop'); // See next

// Add points purchased on shopping site
router.post('/addPoints', authenticateAdminOrShop, async (req, res) => {
  try {
    const { userId, points } = req.body;
    if (!userId || !points || points <= 0) {
      return res.status(400).json({ error: 'Invalid userId or points' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.shoppingPoints = (user.shoppingPoints || 0) + points;
    await user.save();

    res.json({ success: true, shoppingPoints: user.shoppingPoints });
  } catch (err) {
    console.error('Error in /addPoints:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redeem points synced to shopping wallet
router.post('/redeemPoints', authenticateAdminOrShop, async (req, res) => {
  try {
    const { userId, points } = req.body;
    if (!userId || !points || points <= 0) {
      return res.status(400).json({ error: 'Invalid userId or points' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if ((user.shoppingPoints || 0) < points) {
      return res.status(400).json({ error: 'Not enough shopping points to redeem' });
    }

    user.shoppingPoints -= points;
    await user.save();

    // TODO: Call actual shopping wallet API here to sync redeem points

    res.json({ success: true, shoppingPoints: user.shoppingPoints });
  } catch (err) {
    console.error('Error in /redeemPoints:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
