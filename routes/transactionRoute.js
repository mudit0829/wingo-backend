// routes/transactionRoute.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const authenticate = require('../middleware/authenticate');  // Your auth middleware

router.get('/user', authenticate, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id; // from your auth middleware
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router;
