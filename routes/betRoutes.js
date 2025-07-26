const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const Bet = require("../models/bet");
const Round = require("../models/round");
const User = require("../models/user");

router.post("/", authenticate, async (req, res) => {
  try {
    const { type, value, amount } = req.body;

    if (!type || value === undefined || !amount) {
      return res.status(400).json({ message: "Missing required bet data" });
    }

    const user = await User.findById(req.user._id);

    if (user.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    const round = await Round.findOne().sort({ createdAt: -1 });

    const bet = new Bet({
      user: user._id,
      round: round._id,
      type,
      value,
      amount
    });

    // Save bet
    await bet.save();

    // Deduct from wallet
    user.wallet -= amount;
    await user.save();

    res.json({
      message: "Bet placed successfully",
      bet,
      wallet: user.wallet // 🆕 show updated wallet
    });

  } catch (err) {
    console.error("Bet placing error:", err);
    res.status(500).json({ error: "Server error while placing bet" });
  }
});

module.exports = router;
