const Bet = require('../models/Bet');
const User = require('../models/User');

const processBets = async (roundId, result) => {
  const bets = await Bet.find({ roundId });

  for (const bet of bets) {
    const user = await User.findById(bet.userId);
    if (!user) continue;

    let winnings = 0;
    const serviceFee = 0.02;
    const effectiveAmount = bet.amount * (1 - serviceFee); // Deduct 2%

    // Payout Logic
    if (bet.type === 'color') {
      const num = result;
      if (
        (bet.value === 'GREEN' && [1, 3, 7, 9].includes(num)) ||
        (bet.value === 'RED' && [2, 4, 6, 8].includes(num))
      ) {
        winnings = effectiveAmount * 2;
      } else if (bet.value === 'VIOLET' && [0, 5].includes(num)) {
        winnings = effectiveAmount * 4.5;
      } else if (
        (bet.value === 'GREEN' && num === 5) ||
        (bet.value === 'RED' && num === 0)
      ) {
        winnings = effectiveAmount * 1.5;
      }
    } else if (bet.type === 'number' && parseInt(bet.value) === result) {
      winnings = effectiveAmount * 9;
    }

    if (winnings > 0) {
      user.balance += winnings;
      await user.save();
      bet.status = 'win';
      bet.winningAmount = winnings;
    } else {
      bet.status = 'lose';
    }

    await bet.save();
  }
};

module.exports = processBets;
