// controllers/betController.js
const User = require('../models/user');
const Bet = require('../models/bet');
const Round = require('../models/round');

const placeBet = async (req, res) => {
  try {
    console.log("\n== [BET REQUEST RECEIVED] ==");
    const { colorBet, numberBet, bigSmallBet, amount, gameType } = req.body;

    // Validate Game Type
    if (!['WIN30', 'WIN1', 'WIN3', 'WIN5'].includes(gameType)) {
      return res.status(400).json({ message: "Invalid game type" });
    }

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Bet amount must be greater than 0" });
    }

    // Ensure only ONE bet type
    const chosenTypes = [colorBet ? 1 : 0, numberBet != null ? 1 : 0, bigSmallBet ? 1 : 0].reduce((a, b) => a + b, 0);
    if (chosenTypes !== 1) {
      return res.status(400).json({ message: "Select only one bet type" });
    }

    // Validate bets
    const allowedColors = ['Red', 'Green', 'Violet'];
    if (colorBet && !allowedColors.includes(colorBet)) return res.status(400).json({ message: "Invalid color" });
    if (numberBet != null && (numberBet < 0 || numberBet > 9)) return res.status(400).json({ message: "Invalid number" });
    if (bigSmallBet && !['Big', 'Small'].includes(bigSmallBet)) return res.status(400).json({ message: "Invalid Big/Small" });

    // Get current round for the game type
    const currentRound = await Round.findOne({ gameType }).sort({ startTime: -1 });
    if (!currentRound) return res.status(400).json({ message: "No active round for this game" });

    // Cut-off check (allow betting only until 5s before round ends)
    const now = Date.now();
    const elapsed = now - new Date(currentRound.startTime).getTime();
    const gameDurations = { WIN30: 30000, WIN1: 60000, WIN3: 180000, WIN5: 300000 };
    if (elapsed > gameDurations[gameType] - 5000) {
      return res.status(400).json({ message: "Betting closed for this round" });
    }

    // Get user
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check balance
    if (user.wallet < amount) return res.status(400).json({ message: "Insufficient wallet balance" });

    // Deduct & save user wallet
    user.wallet -= amount;
    await user.save();

    // Fee & contractAmount
    const fee = amount * 0.02;
    const contractAmount = amount - fee;

    // Save bet
    const betDoc = new Bet({
      email: user.email,
      gameType,
      roundId: currentRound.roundId,
      colorBet: colorBet || null,
      numberBet: numberBet ?? null,
      bigSmallBet: bigSmallBet || null,
      amount,
      contractAmount,
      netAmount: contractAmount,
      timestamp: new Date()
    });
    await betDoc.save();

    return res.json({ message: "Bet placed successfully", newWalletBalance: user.wallet });

  } catch (err) {
    console.error("💥 [SERVER ERROR PLACING BET]", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAllBets = async (req, res) => {
  try {
    const bets = await Bet.find({ email: req.user.email }).sort({ timestamp: -1 });
    res.json(bets);
  } catch (err) {
    console.error("💥 Error fetching bets:", err);
    res.status(500).json({ message: "Server error fetching bets" });
  }
};

module.exports = { placeBet, getAllBets };
