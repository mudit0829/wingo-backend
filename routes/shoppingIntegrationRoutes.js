const express = require('express');
const router = express.Router();
const User = require('../models/user');
const RechargeLog = require('../models/rechargeLog');
const authenticateAdminOrShop = require('../middleware/authenticateAdminOrShop');

// Recharge API - add points to wallet, log recharge, pay agent commission
router.post('/addPoints', authenticateAdminOrShop, async (req, res) => {
  try {
    const { userId, points } = req.body;
    if (!userId || !points || points <= 0) {
      return res.status(400).json({ error: 'Invalid userId or points' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Add points to wallet
    user.wallet = (user.wallet || 0) + points;

    await user.save();

    // Log recharge
    await RechargeLog.create({ userId, amount: points });

    // Pay 10% to agent if exists
    if (user.agentId) {
      const agent = await User.findById(user.agentId);
      if (agent) {
        agent.salaryEarned = (agent.salaryEarned || 0) + points * 0.10;
        await agent.save();
      }
    }

    res.json({ success: true, wallet: user.wallet });

  } catch (err) {
    console.error('Error in /addPoints:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redeem API - reduce shoppingPoints, assuming shopping site syncs payout
router.post('/redeemPoints', authenticateAdminOrShop, async (req, res) => {
  try {
    const { userId, points } = req.body;
    if (!userId || !points || points <= 0) {
      return res.status(400).json({ error: 'Invalid userId or points' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if ((user.wallet || 0) < points) {
      return res.status(400).json({ error: 'Not enough wallet balance to redeem' });
    }

    // Reduce wallet balance
    user.wallet -= points;
    await user.save();

    // TODO: notify shopping site or payout system to process real cashout

    res.json({ success: true, wallet: user.wallet });

  } catch (err) {
    console.error('Error in /redeemPoints:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
