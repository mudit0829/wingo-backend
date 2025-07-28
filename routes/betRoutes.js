// routes/betRoutes.js

const express = require('express');
const router = express.Router();
const Bet = require('../models/bet');
const User = require('../models/user');
const Round = require('../models/round');
const jwt = require('jsonwebtoken');

// Middleware to verify token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) return res.status(403).json({ error: 'No token provided' });

  const token = bearerHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

// POST /api/bets → Place a new bet
router.post('/', verifyToken, async (req, res) => {
  try {
    const { roundId, betType, choice, amount } = req.body;

    if (!roundId || !betType || !choice || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bet = new Bet({
      user: user._id,
      round: roundId,
      type: betType,
      value: choice,
      amount
    });

    await bet.save();

    res.json({ message: 'Bet placed successfully', bet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place bet' });
  }
});

// ✅ GET /api/bets/user/:username → Fetch all bets of a user
router.get('/user/:username', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bets = await Bet.find({ user: user._id })
      .populate('round', 'roundId timestamp result')
      .sort({ createdAt: -1 });

    res.json(bets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching bets' });
  }
});

// ✅ Admin: GET /api/bets → Get all bets
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

    const bets = await Bet.find()
      .populate('user', 'email')
      .populate('round', 'roundId result timestamp')
      .sort({ createdAt: -1 });

    res.json(bets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching all bets' });
  }
});

module.exports = router;
