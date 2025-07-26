const asyncHandler = require('express-async-handler');
const Bet = require('../models/Bet'); // Case-sensitive!
const Round = require('../models/round');
const User = require('../models/user'); // Also case-sensitive!

// @desc Place a bet
// @route POST /api/bets
// @access Private
const placeBet = asyncHandler(async (req, res) => {
  const { roundId, color, number, amount } = req.body;
  const userId = req.user._id;

  if (!roundId || !amount || (!color && number === undefined)) {
    return res.status(400).json({ message: 'Missing required bet fields' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.wallet < amount) {
    return res.status(400).json({ message: 'Insufficient wallet balance' });
  }

  const round = await Round.findById(roundId);
  if (!round) {
    return res.status(404).json({ message: 'Round not found' });
  }

  // Deduct from user wallet
  user.wallet -= amount;
  await user.save();

  const newBet = new Bet({
    user: userId,
    round: roundId,
    color,
    number,
    amount
  });

  const savedBet = await newBet.save();

  res.status(201).json(savedBet);
});

// @desc Get all bets (admin or user-specific)
// @route GET /api/bets
// @access Private
const getAllBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ user: req.user._id }).populate('round');
  res.status(200).json(bets);
});

module.exports = {
  placeBet,
  getAllBets,
};
