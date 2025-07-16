const express = require("express");
const router = express.Router();
const Round = require("../models/Round");

// Get all rounds
router.get("/", async (req, res) => {
  try {
    const rounds = await Round.find().sort({ startTime: -1 });
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rounds" });
  }
});

module.exports = router;
