const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// Route: GET /api/reset/rounds — TEMPORARY GET METHOD TO DELETE ROUNDS
router.get('/rounds', async (req, res) => {
  try {
    await Round.deleteMany({});
    res.json({ message: 'All game rounds deleted successfully!' });
    console.log('🗑️ All rounds deleted via GET API call.');
  } catch (error) {
    console.error('❌ Error deleting rounds:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
