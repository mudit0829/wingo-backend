const asyncHandler = require("express-async-handler");
const Bet = require("../models/bet");
const Round = require("../models/round");
const User = require("../models/user");

// PLACE A BET
const placeBet = asyncHandler(async (req, res) => {
  const { numberBet, colorBet, amount } = req.body;
  const email = req.user.email;  // current logged-in user's email

  // Find latest active round
  const round = await Round.findOne().sort({ createdAt: -1 });
  if (!round) throw new Error("No active round found");

  // Ensure your Round model has a string identifier
  // If your Round schema has roundId field with "R-..." as value
  const roundIdString = round.roundId || round._id.toString();

  // Find user by email
  const user = await User.findOne({ email });
  if (!user || user.wallet < amount) throw new Error("Insufficient balance");

  // Fee is fixed at 2
  const contractAmount = amount - 2;

  // Deduct wallet
  user.wallet -= amount;
  await user.save();

  // Save bet with string roundId
  const bet = new Bet({
    email,
    roundId: roundIdString,
    numberBet,
    colorBet,
    amount,
    contractAmount,
    win: null
  });
  await bet.save();

  res.status(201).json(bet);
});

// GET ALL BETS for current user
const getAllBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ email: req.user.email })
    .sort({ createdAt: -1 });
  res.json(bets);
});

module.exports = { placeBet, getAllBets };
