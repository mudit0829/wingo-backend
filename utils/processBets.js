const Bet = require('../models/bet');
const User = require('../models/user');

async function processBets(roundId, result) {
  const bets = await Bet.find({ roundId }).populate('user');
  const winningColor = result.color;    // 'Red', 'Green', 'Violet'
  const winningNumber = result.number;  // 0-9

  for (const bet of bets) {
    const amount = bet.amount;
    const contractAmount = bet.contractAmount || (amount - 2);
    let payout = 0;
    let win = false;

    // Color bets
    if (bet.colorBet) {
      if (bet.colorBet === 'Red' && [2, 4, 6, 8, 0].includes(winningNumber)) {
        payout = contractAmount * 2;
        win = true;
      }
      if (bet.colorBet === 'Green' && [1, 3, 7, 9, 5].includes(winningNumber)) {
        payout = contractAmount * 2;
        win = true;
      }
      if (bet.colorBet === 'Violet' && [0, 5].includes(winningNumber)) {
        payout = contractAmount * 4.5;
        win = true;
      }
    }

    // Number bets
    if (typeof bet.numberBet === 'number' && bet.numberBet === winningNumber) {
      payout = contractAmount * 9;
      win = true;
    }

    // Update bet outcome
    bet.win = win;
    bet.netAmount = win ? payout : -amount;
    await bet.save();

    // Credit user if win
    if (win && payout > 0) {
      bet.user.wallet += payout;
      await bet.user.save();
    }
  }
}

module.exports = processBets;
