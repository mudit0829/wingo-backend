const express = require('express');
const router = express.Router();
const { placeBet, getBets } = require('../controllers/betController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, placeBet);       // POST /api/bets
router.get('/', authenticate, getBets);         // GET /api/bets

module.exports = router;
