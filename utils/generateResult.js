const Bet = require('../models/bet');
const Round = require('../models/round');
const User = require('../models/user');

const generateResult = async (roundId) => {
  const round = await Round.findById(roundId);
  if (!round) throw new Error('Round not found');

  // Generate random number 0–9
  const resultNumber = Math.floor(Math.random() * 10);
  let resultColor = '';

  if (resultNumber === 0 || resultNumber === 5) {
    resultColor = 'Violet';
  } else if ([1, 3, 7, 9].includes(resultNumber)) {
    resultColor = 'Green';
  } else {
    resultColor = 'Red';
  }

  round.result = resultNumber;
  round.color = resultColor;
  await round.save();

  // Fetch bets
  const bets = await Bet.find({ roundId });

  for (const bet of bets) {
    const user = await User.findById(bet.userId);
    if (!user) continue;

    let payout = 0;
    const amount = bet.amount;
    const effectiveAmount = amount * 0.98;

    // Color Payout
    if (bet.color && bet.color === resultColor) {
      if (resultColor === 'Violet') payout += effectiveAmount * 4.5;
      else if (resultNumber === 0 || resultNumber === 5) payout += effectiveAmount * 1.5;
      else payout += effectiveAmount * 2;
    }

    // Number Payout
    if (bet.number !== undefined && bet.number === resultNumber) {
      payout += effectiveAmount * 9;
    }

    if (payout > 0) {
      user.wallet += payout;
      await user.save();
    }
  }

  return { resultNumber, resultColor };
};

module.exports = generateResult;
