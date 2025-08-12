const Bet = require('../models/bet');
const User = require('../models/user');

async function processBets(round) {
  const bets = await Bet.find({ roundId: round.roundId, gameType: round.gameType });
  const winningNumber = round.resultNumber;

  for (const bet of bets) {
    const contractAmount = bet.contractAmount || (bet.amount - (bet.amount * 0.02));
    let payout = 0;
    let win = false;

    // = Color bets =
    if (bet.colorBet) {
      if (bet.colorBet === 'Red' && [2, 4, 6, 8].includes(winningNumber)) { payout = contractAmount * 2; win = true; }
      if (bet.colorBet === 'Green' && [1, 3, 7, 9].includes(winningNumber)) { payout = contractAmount * 2; win = true; }
      if (bet.colorBet === 'Violet' && [0, 5].includes(winningNumber)) { payout = contractAmount * 4.5; win = true; }
    }

    // = Number bet =
    if (typeof bet.numberBet === 'number' && bet.numberBet === winningNumber) {
      payout = contractAmount * 9;
      win = true;
    }

    // = Big/Small bets =
    if (bet.bigSmallBet) {
      if (bet.bigSmallBet === 'Big' && winningNumber >= 5 && winningNumber <= 9) { payout = contractAmount * 2; win = true; }
      if (bet.bigSmallBet === 'Small' && winningNumber >= 0 && winningNumber <= 4) { payout = contractAmount * 2; win = true; }
    }

    // = Save result on bet =
    bet.win = win;                               // <-- important: frontend reads this
    bet.status = win ? 'Succeed' : 'Failed';     // For alternative frontend display
    bet.payout = win ? payout : 0;               // Amount won (0 if failed)
    bet.netAmount = win ? payout : -(bet.amount ?? 0);

    await bet.save();

    // = Update user wallet if won =
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
