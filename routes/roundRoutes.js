// routes/roundRoutes.js
const express = require("express");
const router = express.Router();
const Round = require("../models/Round");

// GET all rounds
router.get("/", async (req, res) => {
  try {
    const rounds = await Round.find().sort({ timestamp: -1 }).limit(10);
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rounds", error: err.message });
  }
});

module.exports = router;
