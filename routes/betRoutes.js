const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');
const authenticate = require('../middleware/authenticate');

// POST /api/bets
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { roundId, colorBet, numberBet, betAmount } = req.body;

    if (!roundId || !betAmount || (!colorBet && numberBet === undefined)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const round = await Round.findOne({ roundId });
    if (!round) return res.status(404).json({ message: 'Round not found' });

    const serviceFee = 0.02;
    let totalBetCost = 0;

    // Calculate total cost with fee for color bet
    if (colorBet) {
      totalBetCost += betAmount + (betAmount * serviceFee);
    }

    // Calculate total cost with fee for number bet
    if (numberBet !== undefined && numberBet !== null && numberBet !== '') {
      totalBetCost += betAmount + (betAmount * serviceFee);
    }

    if (user.wallet < totalBetCost) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Store bet
    const newBet = new Bet({
      user: user.username,
      roundId,
      colorBet: colorBet || null,
      numberBet: numberBet !== undefined ? numberBet : null,
      betAmount,
      timestamp: new Date(),
    });

    await newBet.save();

    // Deduct wallet amount
    user.wallet -= totalBetCost;
    await user.save();

    return res.status(201).json({ message: 'Bet placed successfully', wallet: user.wallet });
  } catch (err) {
    console.error('Error placing bet:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
