// routes/betRoutes.js

const express = require("express");
const router = express.Router();
const Bet = require("../models/bet");
const Round = require("../models/round");
const authMiddleware = require("../middleware/authenticate");

// POST /api/bets - Place a new bet
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { roundId, betType, choice, amount } = req.body;

    if (!roundId || !betType || !choice || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const round = await Round.findById(roundId);
    if (!round) {
      return res.status(404).json({ error: "Round not found" });
    }

    const newBet = new Bet({
      user: req.user.id,
      round: roundId,
      type: betType,     // "color" or "number"
      value: choice,     // "RED", "GREEN", "VIOLET" or 0-9
      amount             // Original bet amount
    });

    await newBet.save();
    res.status(201).json({ message: "Bet placed successfully", bet: newBet });

  } catch (error) {
    console.error("Error placing bet:", error.message);
    res.status(500).json({ error: "Server error while placing bet" });
  }
});

// (Optional) GET /api/bets/user/:userId - Get all bets of a user
router.get("/user/:userId", async (req, res) => {
  try {
    const bets = await Bet.find({ user: req.params.userId }).populate("round");
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bets" });
  }
});

module.exports = router;
