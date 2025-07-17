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
router.post('/generate', async (req, res) => {
  try {
    const round = await generateResult(); // <- this must be imported
    res.json({ message: 'Result generated', result: round.result });
  } catch (err) {
    console.error('Error generating result:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
