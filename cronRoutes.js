const express = require('express');
const router = express.Router();
const generateAndSaveResult = require('../utils/generateResult');

router.post('/generate-result', async (req, res) => {
  try {
    const result = await generateAndSaveResult();
    res.json({ success: true, result });
  } catch (err) {
    console.error('[❌] Error in /generate-result:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
