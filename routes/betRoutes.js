const express = require('express');
const router = express.Router();

// Import our fixed controller functions
const { placeBet, getAllBets } = require('../controllers/betController');

// ✅ Place Bet - will calculate contractAmount & deduct wallet
router.post('/', placeBet);

// ✅ Get Bets for a specific user (latest first)
router.get('/user/:email', getAllBets);

module.exports = router;
