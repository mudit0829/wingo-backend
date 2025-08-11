const asyncHandler = require("express-async-handler");
const Bet = require("../models/bet");
const Round = require("../models/round");
const User = require("../models/user");

// PLACE A BET
const placeBet = asyncHandler(async (req, res) => {
  const { numberBet, colorBet, amount } = req.body;
  const userId = req.user._id;

  const round = await Round.findOne().sort({ createdAt: -1 });
  if (!round) throw new Error("No active round");

  const user = await User.findById(userId);
  if (!user || user.wallet < amount) throw new Error("Insufficient balance");

  // fee = 2 units
  const contractAmount = amount - 2;

  // Deduct wallet first
  user.wallet -= amount;
  await user.save();

  // Save bet
  const bet = new Bet({
    user: user._id,
    email: user.email,
    roundId: round._id,
    numberBet,
    colorBet,
    amount,
    contractAmount,
    win: null
  });
  await bet.save();

  res.status(201).json(bet);
});

// GET ALL BETS (for history)
const getAllBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ user: req.user._id })
    .populate("roundId")
    .sort({ createdAt: -1 });
  res.json(bets);
});

module.exports = { placeBet, getAllBets };
