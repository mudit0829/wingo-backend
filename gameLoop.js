const Round = require('./models/round');
const generateResult = require('./utils/generateResult');
const Bet = require('./models/bet');
const User = require('./models/user');

let currentRound = null;

async function startNewRound() {
  try {
    const round = new Round({
      roundId: Date.now().toString(),
      timestamp: new Date(),
    });
    await round.save();
    currentRound = round;
    console.log(`✅ New round started: ${round.roundId}`);
  } catch (error) {
    console.error('❌ Error starting new round:', error);
  }
}

async function endCurrentRound() {
  try {
    if (!currentRound) return;

    const result = generateResult();
    currentRound.resultColor = result.color;
    currentRound.resultNumber = result.number;
    currentRound.timestamp = new Date();
    await currentRound.save();

    console.log(`🎯 Result for round ${currentRound.roundId}: ${result.color} ${result.number}`);

    // Payout logic
    const bets = await Bet.find({ roundId: currentRound.roundId });
    for (const bet of bets) {
      const user = await User.findOne({ email: bet.username });
      if (!user) continue;

      let totalWin = 0;
      const betAmount = bet.amount;
      const effectiveAmount = betAmount * 0.98;

      if (bet.color && result.color === bet.color) {
        if (bet.color === 'Violet') totalWin += effectiveAmount * 4.5;
        else if (result.number === 5 || result.number === 0) totalWin += effectiveAmount * 1.5;
        else totalWin += effectiveAmount * 2;
      }

      if (bet.number !== null &&
