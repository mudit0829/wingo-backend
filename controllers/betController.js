const asyncHandler = require("express-async-handler");
const Bet = require("../models/bet");
const Round = require("../models/round");
const User = require("../models/user");

// PLACE A BET
const placeBet = asyncHandler(async (req, res) => {
  const { numberBet, colorBet, amount } = req.body;
  const email = req.user?.email || req.body.email; // support auth or direct email

  if (!email || !amount) {
    return res.status(400).json({ message: "Email and amount are required" });
  }

  // Find latest active round
  const round = await Round.findOne().sort({ createdAt: -1 });
  if (!round) throw new Error("No active round found");

  const user = await User.findOne({ email });
  if (!user || user.wallet < amount) throw new Error("Insufficient balance");

  // Fixed service fee of 2
  const contractAmount = amount - 2;

  // Deduct wallet immediately
  user.wallet -= amount;
  await user.save();

  // Save bet
  const bet = new Bet({
    email,
    roundId: round.roundId,        // string identifier
    numberBet: numberBet ?? null,
    colorBet: colorBet ?? null,
    amount,
    contractAmount,
    win: null
  });

  await bet.save();

  res.status(201).json({
    message: "Bet placed successfully",
    bet,
    newWalletBalance: user.wallet
  });
});

// GET ALL BETS (by email param/query/auth) with round result info
const getAllBets = asyncHandler(async (req, res) => {
  const email = req.params?.email || req.query?.email || req.user?.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Bets sorted by newest first
  const bets = await Bet.find({ email }).sort({ timestamp: -1 }).lean();

  // Attach round info for each bet
  const roundIds = bets.map(b => b.roundId);
  const rounds = await Round.find({ roundId: { $in: roundIds } }).lean();
  const roundMap = Object.fromEntries(rounds.map(r => [r.roundId, r]));

  const betsWithRoundData = bets.map(bet => {
    const round = roundMap[bet.roundId];
    return {
      ...bet,
      roundResultNumber: round ? round.resultNumber : null,
      roundResultColor: round ? round.resultColor : null,
      roundStartTime: round ? round.startTime : null
    };
  });

  res.json(betsWithRoundData);
});

module.exports = { placeBet, getAllBets };
