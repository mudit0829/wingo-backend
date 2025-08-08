const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const User = require('../models/user');

// ✅ Place Bet - POST /api/bets
router.post('/', async (req, res) => {
  try {
    // Accept both frontend format (color, number) and DB format (colorBet, numberBet)
    let { email, roundId, amount, colorBet, numberBet, color, number } = req.body;

    // Map color/number from frontend to colorBet/numberBet
    if (!colorBet && color) colorBet = color;
    if (numberBet === undefined && number !== undefined) numberBet = number;

    // Validate Request
    if (!email || !roundId || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check Wallet Balance
    if (user.wallet < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct Amount from Wallet
    user.wallet -= amount;
    await user.save();

    // Apply 2% Service Fee
    const netAmount = Math.floor(amount * 0.98);

    // Save Bet
    const newBet = new Bet({
      email,
      roundId,
      amount,
      netAmount,
      colorBet: colorBet || null,
      numberBet: numberBet !== undefined ? numberBet : null,
      win: null, // Pending
      timestamp: new Date()
    });

    await newBet.save();

    res.status(201).json({
      message: 'Bet placed successfully',
      bet: newBet,
      newWalletBalance: user.wallet
    });

  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ message: 'Failed to place bet' });
  }
});

// ✅ Get User Bets - Latest First - GET /api/bets/user/:email
router.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const bets = await Bet.find({ email }).sort({ timestamp: -1 });

    // Ensure safe response (empty array if no bets)
    res.json(bets || []);
  } catch (err) {
    console.error('Error fetching bets:', err);
    res.status(500).json({ message: 'Failed to fetch bets' });
  }
});

module.exports = router;
