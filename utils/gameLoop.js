// utils/gameLoop.js
const Round = require('../models/Round');
const Bet = require('../models/Bet');
const User = require('../models/User');
const { getWinningColor } = require('./gameEngine');

let timerRunning = false;
let lastRoundId = null;

const startTimer = () => {
  if (timerRunning) return;
  timerRunning = true;

  const doRound = async () => {
    const newRound = await Round.create({
      roundId: Date.now().toString(),
      startTime: new Date(),
      endTime: new Date(Date.now() + 30000),
    });
    lastRoundId = newRound.roundId;
    console.log('Started Round', newRound.roundId);

    setTimeout(async () => {
      await generateResult(newRound.roundId);
    }, 30000);
  };

  doRound();
  setInterval(doRound, 30000);
};

const generateResult = async roundId => {
  const round = await Round.findOne({ roundId });
  if (!round) throw new Error('Round not found');

  const number = Math.floor(Math.random() * 10);
  const color = getWinningColor(number);
  round.result = number;
  round.winningColor = color;

  const bets = await Bet.find({ roundId });
  let totalBet = 0, totalPayout = 0;

  for (const bet of bets) {
    const user = await User.findById(bet.user);
    let payout = 0;
    if (bet.type === 'number' && +bet.value === number) payout = bet.amount * 9;
    if (bet.type === 'color' && bet.value === color) payout = bet.amount * (color === 'VIOLET' ? 4.5 : 2);

    bet.status = payout ? 'WIN' : 'LOSE';
    bet.winnings = payout;
    await bet.save();

    totalBet += bet.amount + bet.serviceFee;
    if (payout) {
      user.balance += payout;
      user.winHistory.push({ roundId, amountWon: payout });
      await user.save();
      totalPayout += payout;
    }
  }

  round.bets = bets.map(b => b._id);
  round.profitLoss = totalBet - totalPayout;
  await round.save();
  return round;
};

module.exports = { startTimer, generateResult };
