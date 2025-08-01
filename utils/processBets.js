// utils/processBets.js

const Bet = require('../models/bet');
const User = require('../models/user');

const processBets = async (roundId, result) => {
  const bets = await Bet.find({ roundId });
  const winningColor = result.color;
  const winningNumber = result.number;

  for (const bet of bets) {
    const effectiveAmount = bet.amount * 0.98;
    let payout = 0;

    // Color bet evaluation
    if (bet.color && bet.color === winningColor) {
      if ((winningColor === 'Green' && winningNumber === 5) || (winningColor === 'Red' && winningNumber === 0)) {
        payout += effectiveAmount * 1.5;
      } else {
        payout += effectiveAmount * 2;
      }
    }

    // Violet payout special case
    if (bet.color === 'Violet' && (winningNumber === 0 || winningNumber === 5)) {
      payout += effectiveAmount * 4.5;
    }

    // Number bet evaluation
    if (typeof bet.number === 'number' && bet.number === winningNumber) {
      payout += effectiveAmount * 9;
    }

    if (payout > 0) {
      const user = await User.findOne({ email: bet.email });
      if (user) {
        user.wallet += payout;
        await user.save();
      }
    }
  }
};

module.exports = processBets;
