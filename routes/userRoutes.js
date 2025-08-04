const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Bet = require('../models/bet');

// ✅ Get user wallet by email
router.get('/wallet/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ wallet: user.wallet });
  } catch (err) {
    console.error('Fetch Wallet Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update user wallet balance by amount (+/-)
router.post('/wallet/update', async (req, res) => {
  try {
    const { email, amount } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wallet += amount;  // Can be positive (add) or negative (deduct)
    await user.save();

    res.json({ message: 'Wallet updated successfully', wallet: user.wallet });
  } catch (err) {
    console.error('Update Wallet Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Profit/Loss Calculation API (For Admin Panel)
router.get('/profit-loss', async (req, res) => {
  try {
    const bets = await Bet.find();

    let totalBets = 0;
    let totalDistributed = 0;
    let totalServiceFee = 0;

    bets.forEach(bet => {
      const serviceFee = bet.amount - bet.netAmount;
      totalBets += bet.amount;
      totalServiceFee += serviceFee;

      if (bet.win === true) {
        let winAmount = 0;

        // Color Bet Payout Calculation
        if (bet.colorBet) {
          if (bet.colorBet === 'Violet' && (bet.resultColor === 'Violet')) {
            winAmount += Math.floor(bet.netAmount * 4.5);
          } else if (bet.colorBet === bet.resultColor) {
            if (bet.resultNumber === 0 || bet.resultNumber === 5) {
              winAmount += Math.floor(bet.netAmount * 1.5);
            } else {
              winAmount += Math.floor(bet.netAmount * 2);
            }
          }
        }

        // Number Bet Payout Calculation
        if (bet.numberBet != null && bet.numberBet === bet.resultNumber) {
          winAmount += Math.floor(bet.netAmount * 9);
        }

        totalDistributed += winAmount;
      }
    });

    const profit = totalBets - totalDistributed;

    res.json({
      totalBets,
      totalDistributed,
      totalServiceFee,
      profit
    });

  } catch (err) {
    console.error('Profit/Loss Error:', err);
    res.status(500).json({ message: 'Failed to calculate profit/loss' });
  }
});

module.exports = router;
