const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Example protected route
router.post('/bet', async (req, res) => {
  const { email, betType, betValue, amount } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance or user not found' });
    }

    user.balance -= amount;
    await user.save();

    res.json({ message: 'Bet placed', newBalance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Bet failed' });
  }
});

module.exports = router;
