const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const Bet = require("../models/bet");
const Round = require("../models/round");

router.post("/", authenticate, async (req, res) => {
  try {
    const { type, value, amount } = req.body;

    if (!type || value === undefined || !amount) {
      return res.status(400).json({ message: "Missing required bet data" });
    }

    // Get the latest round
    const round = await Round.findOne().sort({ createdAt: -1 });

    const bet = new Bet({
      user: req.user._id,
      round: round._id,
      type,
      value,
      amount
    });

    await bet.save();

    res.json({
      message: "Bet placed successfully",
      bet
    });
  } catch (err) {
    console.error("Bet placing error:", err);
    res.status(500).json({ error: "Server error while placing bet" });
  }
});

module.exports = router;
