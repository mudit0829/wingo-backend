const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const User = require('../models/user');

// POST /api/bets
router.post('/', async (req, res) => {
  try {
    const { email, roundId, colorBet, numberBet, amount } = req.body;

    if (!email || !roundId || !amount || (!colorBet && numberBet === undefined)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check wallet (deducting from 'wallet' field)
    if (user.wallet < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    user.wallet -= amount;
    await user.save();

    // Apply 2% Service Fee
    const netAmount = Math.floor(amount * 0.98);

    const newBet = new Bet({
      email,
      roundId,
      amount,
      netAmount,
      colorBet: colorBet || null,
      numberBet: numberBet !== undefined ? numberBet : null,
      timestamp: new Date()
    });

    await newBet.save();

    res.status(201).json({
      message: 'Bet placed successfully',
      bet: newBet,
      newWalletBalance: user.wallet
    });
  } catch (error) {
    console.error('Bet Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bets/user/:email
router.get('/user/:email', async (req, res) => {
  try {
    const bets = await Bet.find({ email: req.params.email }).sort({ timestamp: -1 });
    res.json(bets);
  } catch (err) {
    console.error('Fetch Bets Error:', err);
    res.status(500).json({ message: 'Error fetching bets' });
  }
});

module.exports = router;
