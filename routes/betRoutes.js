const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');

// Place bet
router.post('/', async (req, res) => {
  const { username, roundId, color, number, amount } = req.body;

  try {
    const round = await Round.findOne({ roundId });
    if (!round) return res.status(404).json({ message: 'Round not found' });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const serviceFee = amount * 0.02;
    const effectiveAmount = amount - serviceFee;

    const newBet = new Bet({
      username,
      roundId,
      colorBet: color || null,
      numberBet: number || null,
      amount,
      effectiveAmount,
      timestamp: new Date()
    });

    await newBet.save();

    // Deduct from user wallet
    user.wallet -= amount;
    await user.save();

    res.json({ message: 'Bet placed successfully', bet: newBet });
  } catch (error) {
    console.error('Bet Error:', error);
    res.status(500).json({ message: 'Error placing bet' });
  }
});

// Get all bets for user
router.get('/user/:username', async (req, res) => {
  try {
    const bets = await Bet.find({ username: req.params.username });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bets' });
  }
});

module.exports = router;
