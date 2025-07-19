const express = require('express');
const router = express.Router();
const generateResultForLastRound = require('../utils/generateResult');

router.post('/generate-result', async (req, res) => {
  try {
    const result = await generateResultForLastRound();
    res.status(200).json({ success: true, result });
  } catch (err) {
    console.error('Error generating result:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
