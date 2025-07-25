const express = require('express');
const router = express.Router();
const Result = require('../models/result');

router.get('/', async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 }).limit(10);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;
