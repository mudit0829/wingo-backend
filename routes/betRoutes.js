const express = require('express');
const router = express.Router();
const bet = require('../models/bet');
const user = require('../models/user');

// POST new bet
router.post('/', async (req, res) => {
  try {
    const { username, roundId, color, number, amount } = req.body;
    const serviceFee = 0.02;
    const effectiveAmount = amount - amount * serviceFee;

    const newBet = new bet({
      username,
      roundId,
      color,
      number,
      amount,
      effectiveAmount,
      timestamp: new Date(),
    });

    await newBet.save();

    // Deduct balance from user wallet
    const userData = await user.findOne({ username });
    if (!userData) return res.status(404).json({ message: 'User not found' });

    userData.wallet = (userData.wallet || 0) - amount;
    await userData.save();

    res.status(201).json({ message: 'Bet placed', newBet });
  } catch (error) {
    res.status(500).json({ message: 'Error placing bet', error });
  }
});

// GET all bets
router.get('/', async (req, res) => {
  try {
    const allBets = await bet.find().sort({ timestamp: -1 });
    res.json(allBets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bets', error });
  }
});

// GET bets by user
router.get('/user/:username', async (req, res) => {
  try {
    const userBets = await bet.find({ username: req.params.username }).sort({ timestamp: -1 });
    res.json(userBets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bets', error });
  }
});

module.exports = router;
