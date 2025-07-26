const asyncHandler = require('express-async-handler');
const Bet = require('../models/bet');
const Round = require('../models/round');

// POST /api/bets
const placeBet = asyncHandler(async (req, res) => {
  const { color, number, amount, roundId } = req.body;
  const userId = req.user._id;

  if (!amount || (!color && number === undefined)) {
    return res.status(400).json({ message: 'Invalid bet data' });
  }

  const bet = await Bet.create({
    user: userId,
    round: roundId,
    color,
    number,
    amount,
  });

  res.status(201).json(bet);
});

// GET /api/bets
const getBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ user: req.user._id }).populate('round');
  res.json(bets);
});

module.exports = { placeBet, getBets };
