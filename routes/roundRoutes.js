const express = require("express");
const Round = require("../models/Round");
const { generateResult } = require("../utils/generateResult");

const router = express.Router();

// GET all rounds
router.get("/", async (req, res) => {
  try {
    const rounds = await Round.find().sort({ timestamp: -1 });
    res.json(rounds);
  } catch (err) {
    console.error("❌ Error fetching rounds:", err);
    res.status(500).json({ message: "Error fetching rounds" });
  }
});

// POST to manually generate a result
router.post("/generate", async (req, res) => {
  try {
    const round = await generateResult();
    res.json({ message: "Result generated", result: round.result });
  } catch (err) {
    console.error("❌ Error generating result:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
