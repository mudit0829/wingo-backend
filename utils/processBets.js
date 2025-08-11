const Bet = require('../models/bet');
const User = require('../models/user');

async function processBets(roundIdString, result) {
  const bets = await Bet.find({ roundId: roundIdString });
  const winningNumber = result.number;

  for (const bet of bets) {
    const contractAmount = bet.contractAmount || (bet.amount - 2);
    let payout = 0;
    let win = false;

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

    if (typeof bet.numberBet === 'number' && bet.numberBet === winningNumber) {
      payout = contractAmount * 9;
      win = true;
    }

    bet.win = win;
    bet.netAmount = win ? payout : -bet.amount;
    await bet.save();

    if (win && payout > 0) {
      const user = await User.findOne({ email: bet.email });
      if (user) {
        user.wallet += payout;
        await user.save();
      }
    }
  }
}

module.exports = processBets;
