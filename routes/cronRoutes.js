const express = require('express');
const router = express.Router();
const generateGameResult = require('../utils/generateResult');

router.post('/generate-result', async (req, res) => {
  try {
    const newRound = await generateGameResult();
    res.status(200).json(newRound);
  } catch (err) {
    console.error('❌ Failed to generate result:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
