const express = require("express");
const router = express.Router();
const Bet = require("../models/Bet");
const Round = require("../models/Round");

// POST: Place a new bet
router.post("/", async (req, res) => {
  const { username, color, amount } = req.body;

  try {
    // Get latest round (most recent with no result yet)
    const currentRound = await Round.findOne({ result: null }).sort({ startTime: -1 });

    if (!currentRound) {
      return res.status(400).json({ message: "No active round found" });
    }

    const bet = new Bet({
      username,
      color,
      amount,
      roundId: currentRound.roundId
    });

    await bet.save();
    res.json({ message: "Bet placed successfully", bet });
  } catch (err) {
    console.error("❌ Error placing bet:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: List all bets (admin/debug)
router.get("/", async (req, res) => {
  const bets = await Bet.find().sort({ createdAt: -1 });
  res.json(bets);
});

module.exports = router;
