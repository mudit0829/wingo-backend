const Bet = require('../models/bet');
const User = require('../models/user');

async function processBets(roundId, result) {
  const bets = await Bet.find({ roundId });
  const winningNumber = result.number; // actual 0-9 result

  for (const bet of bets) {
    const amount = bet.amount;
    const contractAmount = bet.contractAmount || (amount - 2);

    let payout = 0;
    let win = false;

    // ----- COLOR BET LOGIC -----
    if (bet.colorBet) {
      if (bet.colorBet === 'Red' && [2, 4, 6, 8, 0].includes(winningNumber)) {
        payout = contractAmount * 2;
        win = true;
      }
      if (bet.colorBet === 'Green' && [1, 3, 7, 9, 5].includes(winningNumber)) {
        payout = contractAmount * 2;
        win = true;
      }
      if (bet.colorBet === 'Violet' && (winningNumber === 0 || winningNumber === 5)) {
        payout = contractAmount * 4.5;
        win = true;
      }
    }

    // ----- NUMBER BET LOGIC -----
    if (typeof bet.numberBet === 'number' && bet.numberBet === winningNumber) {
      payout = contractAmount * 9;
      win = true;
    }

    // Update bet in DB
    bet.win = win;
    bet.netAmount = win ? payout : -amount;
    await bet.save();

    // Credit winnings if win
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
