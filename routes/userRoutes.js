const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Bet = require('../models/bet');
const Round = require('../models/round');

// ✅ Get user wallet by email
router.get('/wallet/:email', async (req, res) => {
  try {
    const email = req.params?.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
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
    if (!email || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Email and numeric amount are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wallet += amount; // positive (credit) or negative (debit)
    await user.save();

    res.json({
      message: 'Wallet updated successfully',
      wallet: user.wallet
    });
  } catch (err) {
    console.error('Update Wallet Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Improved Profit/Loss Calculation API (For Admin Panel)
router.get('/profit-loss', async (req, res) => {
  try {
    // Fetch all bets
    const bets = await Bet.find().lean();

    // Get all roundIds referenced by bets
    const roundIds = [...new Set(bets.map(bet => bet.roundId))];

    // Fetch rounds for those roundIds
    const rounds = await Round.find({ roundId: { $in: roundIds } }).lean();
    const roundMap = Object.fromEntries(rounds.map(r => [r.roundId, r]));

    let totalBets = 0;
    let totalDistributed = 0;
    let totalServiceFee = 0;

    for (const bet of bets) {
      const round = roundMap[bet.roundId];
      const resultNumber = round ? round.resultNumber : null;
      const resultColor = round ? round.resultColor : null;

      // Calculate service fee
      const serviceFee = bet.amount - (bet.contractAmount ?? bet.amount);
      totalBets += bet.amount;
      totalServiceFee += serviceFee;

      if (bet.win === true && bet.contractAmount != null) {
        let winAmount = 0;

        // ---- Color Bet Payout ----
        if (bet.colorBet) {
          if (bet.colorBet === 'Red' && [2, 4, 6, 8, 0].includes(resultNumber)) {
            winAmount += bet.contractAmount * 2;
          }
          if (bet.colorBet === 'Green' && [1, 3, 7, 9, 5].includes(resultNumber)) {
            winAmount += bet.contractAmount * 2;
          }
          if (bet.colorBet === 'Violet' && [0, 5].includes(resultNumber)) {
            winAmount += bet.contractAmount * 4.5;
          }
        }

        // ---- Number Bet Payout ----
        if (bet.numberBet != null && bet.numberBet === resultNumber) {
          winAmount += bet.contractAmount * 9;
        }

        totalDistributed += winAmount;
      }
    }

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
