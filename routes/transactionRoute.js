const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction'); // adjust path if needed
const authenticate = require('../middleware/authenticate'); // your auth middleware

// GET /api/transactions/user
router.get('/user', authenticate, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // depends on your auth middleware user field
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router;
