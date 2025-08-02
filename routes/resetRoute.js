const express = require('express');
const router = express.Router();
const Round = require('../models/round');

// TEMPORARY GET API for Reset
router.get('/reset-rounds', async (req, res) => {
  try {
    await Round.deleteMany({});
    res.json({ message: 'All game rounds deleted successfully via GET API!' });
    console.log('🗑️ All rounds deleted via GET API call.');
  } catch (error) {
    console.error('❌ Error deleting rounds:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
