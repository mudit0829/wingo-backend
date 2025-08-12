// controllers/betController.js
const User = require('../models/user'); // or ../models/userModel if using that one for auth
const Bet = require('../models/bet');
const Round = require('../models/round');

const placeBet = async (req, res) => {
  try {
    console.log("\n== [BET REQUEST RECEIVED] ==");
    console.log("req.user:", req.user);
    console.log("Request body:", req.body);

    const { colorBet, numberBet, bigSmallBet, amount } = req.body;

    // 1️⃣ Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Bet amount must be greater than 0" });
    }

    // 2️⃣ Ensure only ONE bet type is chosen
    const chosenTypes = [colorBet ? 1 : 0, numberBet != null ? 1 : 0, bigSmallBet ? 1 : 0].reduce((a, b) => a + b, 0);
    if (chosenTypes !== 1) {
      return res.status(400).json({ message: "Select only one bet type (color, number, or Big/Small)" });
    }

    // 3️⃣ Validate color bet
    const allowedColors = ['Red', 'Green', 'Violet'];
    if (colorBet && !allowedColors.includes(colorBet)) {
      return res.status(400).json({ message: "Invalid color selected" });
    }

    // 4️⃣ Validate number bet
    if (numberBet != null && (numberBet < 0 || numberBet > 9)) {
      return res.status(400).json({ message: "Invalid number selected" });
    }

    // 5️⃣ Validate Big/Small bet
    if (bigSmallBet && !['Big', 'Small'].includes(bigSmallBet)) {
      return res.status(400).json({ message: "Invalid Big/Small selection" });
    }

    // 6️⃣ Get latest round
    const currentRound = await Round.findOne().sort({ startTime: -1 });
    if (!currentRound) {
      return res.status(400).json({ message: "No active round" });
    }

    // 7️⃣ Check betting cutoff (25s)
    const now = Date.now();
    const elapsed = now - new Date(currentRound.startTime).getTime();
    if (elapsed > 25000) {
      return res.status(400).json({ message: "Betting closed for this round" });
    }

    // 8️⃣ Get user
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 9️⃣ Check wallet balance
    if (user.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // 🔟 Deduct bet amount
    user.wallet -= amount;
    await user.save();

    // 1️⃣1️⃣ Fee deduction
    const fee = amount * 0.02;
    const contractAmount = amount - fee;
    const netAmount = contractAmount;

    // 1️⃣2️⃣ Save bet
    const betDoc = new Bet({
      email: user.email,
      roundId: currentRound.roundId,
      colorBet: colorBet || null,
      numberBet: numberBet ?? null,
      bigSmallBet: bigSmallBet || null,
      amount,
      contractAmount,
      netAmount,
      timestamp: new Date()
    });

    await betDoc.save();

    // 1️⃣3️⃣ Response
    return res.json({
      message: "Bet placed successfully",
      newWalletBalance: user.wallet
    });
  } catch (err) {
    console.error("💥 [SERVER ERROR PLACING BET]", err);
    return res.status(500).json({ message: "Server error placing bet", error: err.message });
  }
};

const getAllBets = async (req, res) => {
  try {
    // ✅ Big/Small bet included in response automatically
    const bets = await Bet.find({ email: req.user.email }).sort({ timestamp: -1 });
    res.json(bets);
  } catch (err) {
    console.error("💥 Error fetching bets:", err);
    res.status(500).json({ message: "Server error fetching bets" });
  }
};

module.exports = { placeBet, getAllBets };
