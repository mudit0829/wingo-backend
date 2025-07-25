const Bet = require('../models/Bet');
const User = require('../models/User');

const processBets = async (roundId, result) => {
  const bets = await Bet.find({ roundId });

  for (const bet of bets) {
    const user = await User.findById(bet.userId);
    if (!user) continue;

    let winnings = 0;

    // Payout logic
    if (bet.type === 'color') {
      if (
        (bet.value === 'RED' && [1, 3, 7, 9].includes(result.number)) ||
        (bet.value === 'GREEN' && [2, 4, 6, 8].includes(result.number)) ||
        (bet.value === 'VIOLET' && [0, 5].includes(result.number))
      ) {
        winnings = bet.amount * (bet.value === 'VIOLET' ? 4.5 : 2);
      }
    } else if (bet.type === 'number' && bet.value == result.number) {
      winnings = bet.amount * 9;
    }

    if (winnings > 0) {
      user.balance += winnings;
      await user.save();
    }

    // Mark bet status
    bet.status = winnings > 0 ? 'win' : 'lose';
    await bet.save();
  }
};

module.exports = processBets;
