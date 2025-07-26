const express = require("express");
const router = express.Router();
const Round = require("../models/round");

// ✅ Get current round
router.get("/current", async (req, res) => {
  try {
    const currentRound = await Round.findOne().sort({ createdAt: -1 }).limit(1);
    if (!currentRound) {
      return res.status(404).json({ message: "No current round found" });
    }
    res.json(currentRound);
  } catch (err) {
    console.error("Error fetching current round:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
