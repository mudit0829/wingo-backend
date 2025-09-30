const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const authenticate = require('../middleware/authenticate');

router.get('/user', authenticate, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router;
