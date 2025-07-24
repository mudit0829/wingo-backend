const express = require('express');
const router = express.Router();
const { startTimer, generateResult } = require('../utils/gameLoop');

// Starts the auto game timer loop (30s rounds)
router.get('/start-timer', (req, res) => {
  try {
    startTimer();
    res.status(200).json({ message: 'Game timer started successfully' });
  } catch (error) {
    console.error('Error starting game timer:', error);
    res.status(500).json({ error: 'Failed to start game timer' });
  }
});

// Generates result manually for a specific round (used in emergencies or testing)
router.post('/generate-result', async (req, res) => {
  try {
    const { roundId } = req.body;
    if (!roundId) {
      return res.status(400
