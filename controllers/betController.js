// controllers/betController.js
const User = require('../models/user');
const Bet = require('../models/bet');
const Round = require('../models/round');

/**
 * Place a bet
 */
const placeBet = async (req, res) => {
  try {
    console.log("\n==== [BET REQUEST RECEIVED] ====");
    console.log("req.user:", req.user);
    console.log("Request body:", req.body);

    const { colorBet, numberBet, amount } = req.body;

    // 1️⃣ Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.log("❌ Invalid amount");
      return res.status(400).json({ message: "Bet amount must be greater than 0" });
    }

    // 2️⃣ Validate bet type: only one is allowed
    if ((colorBet && numberBet != null) || (!colorBet && numberBet == null)) {
      console.log("❌ Invalid bet type (both or none)");
      return res.status(400).json({ message: "Select only color OR number" });
    }

    // 3️⃣ Validate color
    const allowedColors = ['Red', 'Green', 'Violet'];
    if (colorBet && !allowedColors.includes(colorBet)) {
      console.log("❌ Invalid color:", colorBet);
      return res.status(400).json({ message: "Invalid color selected" });
    }

    // 4️⃣ Validate number
    if (numberBet != null && (numberBet < 0 || numberBet > 9)) {
      console.log("❌ Invalid number:", numberBet);
      return res.status(400).json({ message: "Invalid number selected" });
    }

    // 5️⃣ Fetch latest round
    const currentRound = await Round.findOne().sort({ startTime: -1 });
    if (!currentRound) {
      console.log("❌ No active round found in DB");
      return res.status(400).json({ message: "No active round" });
    }

    console.log(`Fetched round: ${currentRound.roundId}, startTime=${currentRound.startTime}`);

    // 6️⃣ Timing check
    const now = Date.now();
    const roundStart = new Date(currentRound.startTime).getTime();
    const elapsed = now - roundStart;

    console.log("🕒 Now:", new Date(now).toISOString());
    console.log("🕒 Round start:", new Date(roundStart).toISOString());
    console.log("⏱ Elapsed seconds:", (elapsed / 1000).toFixed(2));

    if (elapsed > 25000) {
      console.log("❌ Betting closed (> 25s elapsed)");
      return res.status(400).json({ message: "Betting closed for this round" });
    }

    // 7️⃣ Fetch user from DB
    console.log("Looking up user by ID:", req.user?._id);
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(400).json({ message: "User not found" });
    }

    console.log(`💰 User wallet before bet: ${user.wallet}`);

    // 8️⃣ Check wallet balance
    if (user.wallet < amount) {
      console.log(`❌ Insufficient funds: Wallet=${user.wallet}, Bet=${amount}`);
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // 9️⃣ Deduct and save user
    user.wallet -= amount;
    console.log(`Wallet after deduction: ${user.wallet}`);
    await user.save();
    console.log("✅ User wallet updated in DB");

    // 🔟 Create and save bet
    const betDoc = new Bet({
      user: user._id,
      roundId: currentRound.roundId,
      colorBet: colorBet || null,
      numberBet: numberBet ?? null,
      amount,
      timestamp: new Date()
    });

    console.log("Saving bet to DB:", betDoc);
    await betDoc.save();
    console.log("✅ Bet saved in DB");

    // 1️⃣1️⃣ Respond success
    return res.json({
      message: "Bet placed successfully",
      newWalletBalance: user.wallet
    });

  } catch (err) {
    console.error("💥 [SERVER ERROR PLACING BET]", err);
    if (err.stack) console.error(err.stack);
    return res.status(500).json({ message: "Server error placing bet" });
  }
};

/**
 * Get bets for current logged-in user
 */
const getAllBets = async (req, res) => {
  try {
    console.log(`Fetching all bets for user: ${req.user?._id}`);
    const bets = await Bet.find({ user: req.user._id }).sort({ timestamp: -1 });
    res.json(bets);
  } catch (err) {
    console.error("💥 Error fetching bets:", err);
    if (err.stack) console.error(err.stack);
    res.status(500).json({ message: "Server error fetching bets" });
  }
};

module.exports = { placeBet, getAllBets };
