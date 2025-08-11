const asyncHandler = require("express-async-handler");
const Bet = require("../models/bet");
const Round = require("../models/round");
const User = require("../models/user");

// PLACE A BET
const placeBet = asyncHandler(async (req, res) => {
  const { numberBet, colorBet, amount } = req.body;
  const email = req.user.email;

  const round = await Round.findOne().sort({ createdAt: -1 });
  if (!round) throw new Error("No active round found");

  const user = await User.findOne({ email });
  if (!user || user.wallet < amount) throw new Error("Insufficient balance");

  const contractAmount = amount - 2;

  // Deduct immediately
  user.wallet -= amount;
  await user.save();

  const bet = new Bet({
    email,
    roundId: round.roundId,  // string field
    numberBet: numberBet ?? null,
    colorBet: colorBet ?? null,
    amount,
    contractAmount,
    win: null
  });

  await bet.save();

  res.status(201).json({
    message: 'Bet placed successfully',
    bet,
    newWalletBalance: user.wallet
  });
});

// GET ALL BETS for current user
const getAllBets = asyncHandler(async (req, res) => {
  const bets = await Bet.find({ email: req.user.email })
    .sort({ timestamp: -1 });
  res.json(bets);
});

module.exports = { placeBet, getAllBets };
