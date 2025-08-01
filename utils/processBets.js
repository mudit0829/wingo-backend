const Bet = require('../models/bet');
const User = require('../models/user');

const processBets = async (roundId, result) => {
  const bets = await Bet.find({ roundId });

  for (const bet of bets) {
    const user = await User.findById(bet.userId);
    if (!user) continue;

    const serviceFee = 0.02;
    const effectiveAmount = bet.amount * (1 - serviceFee);
    let winnings = 0;

    const num = result;

    if (bet.type === 'color') {
      const color = bet.value;

      if ((color === 'GREEN' && [1, 3, 7, 9].includes(num)) ||
          (color === 'RED' && [2, 4, 6, 8].includes(num))) {
        winnings = effectiveAmount * 2;
      } else if (color === 'VIOLET' && [0, 5].includes(num)) {
        winnings = effectiveAmount * 4.5;
      } else if ((color === 'GREEN' && num === 5) || (color === 'RED' && num === 0)) {
        winnings = effectiveAmount * 1.5;
      }

    } else if (bet.type === 'number' && parseInt(bet.value) === num) {
      winnings = effectiveAmount * 9;
    }

    if (winnings > 0) {
      user.balance += winnings;
      bet.status = 'win';
      bet.winningAmount = winnings;
    } else {
      bet.status = 'lose';
      bet.winningAmount = 0;
    }

    await user.save();
    await bet.save();
  }
};

module.exports = processBets;
