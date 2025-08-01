const express = require('express');
const router = express.Router();
const { startGameLoop } = require('../gameLoop');

// Manually trigger a new round (for admin button or debugging)
router.get('/run', async (req, res) => {
  try {
    await startGameLoop();
    res.status(200).json({ message: '✅ Game round started successfully' });
  } catch (error) {
    console.error('❌ Error triggering game loop:', error.message);
    res.status(500).json({ error: 'Failed to start game round' });
  }
});

module.exports = router;
