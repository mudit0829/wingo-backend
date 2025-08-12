const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authenticate');
const User = require('../models/user');
const Bet = require('../models/bet');
const Round = require('../models/round');

// ====================
// PLACE A BET (with debug logging)
// ====================
router.post('/', protect, async (req, res) => {
  try {
    console.log("\n==== NEW BET REQUEST ====");
    console.log("User:", req.user.email);
    console.log("Payload received:", req.body);

    const { colorBet, numberBet, amount } = req.body;

    // 1️⃣ Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.log("❌ Invalid amount");
      return res.status(400).json({ message: "Bet amount must be greater than 0" });
    }

    // 2️⃣ Validate bet type
    if ((colorBet && numberBet != null) || (!colorBet && numberBet == null)) {
      console.log("❌ Invalid bet type (both or none)");
      return res.status(400).json({ message: "Select only color OR number" });
    }

    const allowedColors = ['Red', 'Green', 'Violet'];
    if (colorBet && !allowedColors.includes(colorBet)) {
      console.log("❌ Invalid color:", colorBet);
      return res.status(400).json({ message: "Invalid color selected" });
    }

    if (numberBet != null && (numberBet < 0 || numberBet > 9)) {
      console.log("❌ Invalid number:", numberBet);
      return res.status(400).json({ message: "Invalid number selected" });
    }

    // 3️⃣ Get latest round
    const currentRound = await Round.findOne().sort({ startTime: -1 });
    if (!currentRound) {
      console.log("❌ No active round found");
      return res.status(400).json({ message: "No active round" });
    }

    // 4️⃣ Debug timing info
    const now = Date.now();
    const roundStart = new Date(currentRound.startTime).getTime();
    const elapsed = now - roundStart;

    console.log("🕒 Server now:", new Date(now).toISOString());
    console.log("🕒 Round start:", new Date(roundStart).toISOString());
    console.log("⏱ Elapsed (ms):", elapsed);
    console.log("⏱ Elapsed (seconds):", (elapsed / 1000).toFixed(2));

    // 5️⃣ Check betting window (25s)
    if (elapsed > 25000) {
      console.log("❌ Betting closed for this round");
      return res.status(400).json({ message: "Betting closed for this round" });
    }

    // 6️⃣ Check wallet
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(400).json({ message: "User not found" });
    }
    console.log(`💰 Wallet balance: ${user.wallet}`);

    if (user.wallet < amount) {
      console.log(`❌ Insufficient funds: Wallet=${user.wallet}, Bet=${amount}`);
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // 7️⃣ Deduct & save
    user.wallet -= amount;
    await user.save();

    // 8️⃣ Save bet
    const bet = new Bet({
      user: user._id,
      roundId: currentRound.roundId,
      colorBet: colorBet || null,
      numberBet: numberBet ?? null,
      amount,
      timestamp: new Date()
    });

    await bet.save();
    console.log("✅ Bet saved:", bet);

    res.json({
      message: "Bet placed successfully",
      newWalletBalance: user.wallet
    });

  } catch (err) {
    console.error("💥 Server error placing bet:", err);
    res.status(500).json({ message: "Server error placing bet" });
  }
});

module.exports = router;
