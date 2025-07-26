const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// GET all rounds
router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ createdAt: -1 });
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
