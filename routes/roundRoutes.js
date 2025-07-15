const express = require("express");
const router = express.Router();
const Round = require("../models/Round");

// GET latest 10 rounds
router.get("/", async (req, res) => {
  try {
    const rounds = await Round.find().sort({ startTime: -1 }).limit(10);
    res.json(rounds);
  } catch (err) {
    console.error("❌ Error fetching rounds:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
