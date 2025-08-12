// routes/betRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authenticate');
const User = require('../models/user');
const Bet = require('../models/bet');
const Round = require('../models/round');

// Place a bet
router.post('/', protect, async (req, res) => {
  try {
    console.log("=== BET REQUEST RECEIVED ===");
    console.log("User:", req.user.email);
    console.log("Payload:", req.body);

    const { colorBet, numberBet, amount } = req.body;

    // Amount must be number > 0
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.log("❌ Rejected: Invalid bet amount");
      return res.status(400).json({ message: "Bet amount must be greater than 0" });
    }

    // Must send ONLY colorBet OR numberBet
    if ((colorBet && numberBet != null) || (!colorBet && numberBet == null)) {
      console.log("❌ Rejected: Invalid bet type selection");
      return res.status(400).json({ message: "Select only color OR number" });
    }

    // Allowed color values
    const allowedColors = ['Red', 'Green', 'Violet'];
    if (colorBet && !allowedColors.includes(colorBet)) {
      console.log("❌ Rejected: Invalid colorBet value:", colorBet);
      return res.status(400).json({ message: "Invalid color selected" });
    }

    // Allowed numbers 0–9
    if (numberBet != null && (numberBet < 0 || numberBet > 9)) {
      console.log("❌ Rejected: Invalid numberBet value:", numberBet);
      return res.status(400).json({ message: "Invalid number selected" });
    }

    // Check betting window is still open
    const currentRound = await Round.findOne().sort({ startTime: -1 });
    if (!currentRound) {
      console.log("❌ Rejected: No active round found");
      return res.status(400).json({ message: "No active round" });
    }

    const now = Date.now();
    const roundStart = new Date(currentRound.startTime).getTime();
    if (now - roundStart > 25000) {
      console.log("❌ Rejected: Betting window closed");
      return res.status(400).json({ message: "Betting closed for this round" });
    }

    // Check wallet balance
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("❌ Rejected: User not found in DB");
      return res.status(400).json({ message: "User not found" });
    }
    if (user.wallet < amount) {
      console.log(`❌ Rejected: Insufficient funds. Wallet=${user.wallet}, Bet=${amount}`);
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct and save bet
    user.wallet -= amount;
    await user.save();

    const bet = new Bet({
      user: user._id,
      roundId: currentRound.roundId,
      colorBet: colorBet || null,
      numberBet: numberBet ?? null,
      amount,
      timestamp: new Date()
    });
    await bet.save();

    console.log("✅ Bet accepted:", bet);

    res.json({ message: "Bet placed successfully", newWalletBalance: user.wallet });

  } catch (err) {
    console.error("💥 Bet placing error:", err);
    res.status(500).json({ message: "Server error placing bet" });
  }
});

module.exports = router;
