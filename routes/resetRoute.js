const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// API Endpoint: DELETE /api/reset/rounds
router.delete('/rounds', async (req, res) => {
  try {
    await Round.deleteMany({});
    res.json({ message: 'All game rounds deleted successfully!' });
    console.log('🗑️ All rounds deleted via API call.');
  } catch (error) {
    console.error('❌ Error deleting rounds:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
