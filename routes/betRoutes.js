const express = require('express');
const { placeBet, getAllBets } = require('../controllers/betController');
const { protect } = require('../middleware/authenticate'); // adjust path if needed
const router = express.Router();

// ✅ Place bet — must be logged in
router.post('/', protect, placeBet);

// ✅ Get bets for the logged‑in user — always own bets
router.get('/user', protect, getAllBets);

module.exports = router;
