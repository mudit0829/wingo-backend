const Round = require('./models/round');
const generateResult = require('./utils/generateResult');
const Bet = require('./models/bet');
const User = require('./models/user');

let currentRound = null;

async function startNewRound() {
  try {
    const now = new Date();
    const roundId = `R-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    const round = new Round({
      roundId,
      timestamp: now,
    });

    await round.save();
    currentRound = round;
    console.log(`✅ New round started: ${roundId}`);
  } catch (error) {
    console.error('❌ Error starting new round:', error);
  }
}

async function endCurrentRound() {
  try {
    if (!currentRound) return;

    const result = generateResult(); // { color: 'Red', number: 1 }
    currentRound.resultColor = result.color;
    currentRound.resultNumber = result.number;
    currentRound.timestamp = new Date();
    await currentRound.save();

    console.log(`🎯 Result for round ${currentRound.roundId}: ${result.color} ${result.number}`);

    const bets = await Bet.find({ roundId: currentRound.roundId });

    for (const bet of bets) {
      const user = await User.findOne({ email: bet.username });
      if (!user) continue;

      let totalWin = 0;
      const betAmount = bet.amount;
      const effectiveAmount = betAmount * 0.98;

      // Color bet win logic
      if (bet.color && result.color === bet.color) {
        if (bet.color === 'Violet') {
          totalWin += effectiveAmount * 4.5;
        } else if (result.number === 0 || result.number === 5) {
          totalWin += effectiveAmount * 1.5;
        } else {
          totalWin += effectiveAmount * 2;
        }
      }

      // Number bet win logic
      if (bet.number !== null && bet.number === result.number) {
        totalWin += effectiveAmount * 9;
      }

      if (totalWin > 0) {
        user.wallet += totalWin;
        await user.save();
        console.log(`💰 User ${user.email} won ₹${Math.floor(totalWin)} in round ${currentRound.roundId}`);
      }
    }

    currentRound = null;
  } catch (error) {
    console.error('❌ Error ending round:', error);
  }
}

function startGameLoop() {
  startNewRound();
  setInterval(async () => {
    await endCurrentRound();
    await startNewRound();
  }, 30000); // 30 seconds
}

module.exports = { startGameLoop };
