const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const { protect } = require('../middleware/authenticate'); // Destructure protect middleware

router.get('/user', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router;
