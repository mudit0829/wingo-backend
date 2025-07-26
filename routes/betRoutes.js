const express = require('express');
const router = express.Router();
const { placeBet } = require('../controllers/betController');
const authenticate = require('../middleware/authenticate');

// POST /api/bets
router.post('/', authenticate, placeBet);

module.exports = router;
