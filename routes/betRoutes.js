const express = require('express');
const { placeBet, getAllBets } = require('../controllers/betController');
const router = express.Router();

// Place Bet (calculation + wallet deduction in controller)
router.post('/', placeBet);

// Get Bets (by email param or auth)
router.get('/user/:email?', getAllBets);

module.exports = router;
