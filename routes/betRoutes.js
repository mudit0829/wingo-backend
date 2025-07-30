// routes/betRoutes.js

const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');

// POST /api/bets
router.post('/', async (req, res) => {
  try {
    const { email, roundId, colorBet, numberBet, amount } = req.body;

    if (!email || !roundId || !amount || (!colorBet && numberBet === undefined)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Apply service fee (2%)
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

    res.status(201).json({ message: 'Bet placed successfully', bet: newBet });
  } catch (error) {
    console.error('Bet Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bets/user/:email
router.get('/user/:email', async (req, res) => {
  try {
    const bets = await Bet.find({ email: req.params.email });
    res.json(bets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bets' });
  }
});

module.exports = router;
