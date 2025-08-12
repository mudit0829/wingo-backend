// controllers/betController.js
const User = require('../models/user'); // or ../models/userModel if using that one for auth
const Bet = require('../models/bet');
const Round = require('../models/round');

const placeBet = async (req, res) => {
  try {
    console.log("\n== [BET REQUEST RECEIVED] ==");
    console.log("req.user:", req.user);
    console.log("Request body:", req.body);

    const { colorBet, numberBet, amount } = req.body;

    // 1️⃣ Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: "Bet amount must be greater than 0" });
    }

    // 2️⃣ Validate bet type (only color OR number)
    if ((colorBet && numberBet != null) || (!colorBet && numberBet == null)) {
      return res.status(400).json({ message: "Select only color OR number" });
    }

    // 3️⃣ Validate color
    const allowedColors = ['Red', 'Green', 'Violet'];
    if (colorBet && !allowedColors.includes(colorBet)) {
      return res.status(400).json({ message: "Invalid color selected" });
    }

    // 4️⃣ Validate number
    if (numberBet != null && (numberBet < 0 || numberBet > 9)) {
      return res.status(400).json({ message: "Invalid number selected" });
    }

    // 5️⃣ Get latest round
    const currentRound = await Round.findOne().sort({ startTime: -1 });
    if (!currentRound) {
      return res.status(400).json({ message: "No active round" });
    }

    // 6️⃣ Check betting time < 25 sec from start
    const now = Date.now();
    const elapsed = now - new Date(currentRound.startTime).getTime();
    if (elapsed > 25000) {
      return res.status(400).json({ message: "Betting closed for this round" });
    }

    // 7️⃣ Find the user
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 8️⃣ Check wallet balance
    if (user.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // 9️⃣ Deduct from wallet
    user.wallet -= amount;
    await user.save();

    // 🔟 Calculate contractAmount with 2% fee
    const fee = amount * 0.02;
    const contractAmount = amount - fee;
    const netAmount = contractAmount; // Optional: you can set or use as needed

    // 1️⃣1️⃣ Create and save the bet - include required fields
    const betDoc = new Bet({
      email: user.email,               // required by schema
      roundId: currentRound.roundId,  // required by schema
      colorBet: colorBet || null,
      numberBet: numberBet ?? null,
      amount,                         // required by schema
      contractAmount,                 // required by schema, now 2%
      netAmount,                     // optional
      timestamp: new Date()
    });

    await betDoc.save();

    // 1️⃣2️⃣ Respond success
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
    const bets = await Bet.find({ email: req.user.email }).sort({ timestamp: -1 });
    res.json(bets);
  } catch (err) {
    console.error("💥 Error fetching bets:", err);
    res.status(500).json({ message: "Server error fetching bets" });
  }
};

module.exports = { placeBet, getAllBets };
