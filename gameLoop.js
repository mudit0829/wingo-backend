const Round = require('./models/round');
const generateResult = require('./utils/generateResult');
const Bet = require('./models/bet');
const User = require('./models/user');

let isRunning = false;
let currentRound = null;

async function startNewRound() {
  try {
    const now = new Date();
    const roundId = `R-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

    // Ensure unique round
    const existing = await Round.findOne({ roundId });
    if (existing) {
      console.warn(`⚠️ Round ${roundId} already exists, skipping.`);
      return;
    }

    currentRound = new Round({
      roundId,
      timestamp: now,
    });

    await currentRound.save();
    console.log(`✅ New round started: ${roundId}`);
  } catch (error) {
    console.error('❌ Error starting new round:', error);
  }
}

async function endCurrentRound() {
  try {
    if (!currentRound) {
      console.warn('⚠️ No current round to end.');
      return;
    }

    const result = await generateResult(currentRound);
    if (!result) {
      console.warn('⚠️ No result generated.');
      currentRound = null;
      return;
    }

    currentRound.resultColor = result.resultColor;
    currentRound.resultNumber = result.resultNumber;
    currentRound.timestamp = new Date();
    await currentRound.save();

    console.log(`🎯 Result for round ${currentRound.roundId}: ${result.resultNumber} ${result.resultColor}`);

    const bets = await Bet.find({ roundId: currentRound.roundId });
    if (bets.length === 0) {
      console.log(`🛑 No bets placed in round ${currentRound.roundId}.`);
      currentRound = null;
      return;
    }

    for (const bet of bets) {
      const user = await User.findOne({ email: bet.username });
      if (!user) continue;

      let totalWin = 0;
      const betAmount = bet.amount;
      const effectiveAmount = betAmount * 0.98; // Deduct 2% service fee

      // Color Bet Logic
      if (bet.color && result.resultColor === bet.color) {
        if (bet.color === 'Violet') {
          totalWin += effectiveAmount * 4.5;
        } else if (result.resultNumber === 0 || result.resultNumber === 5) {
          totalWin += effectiveAmount * 1.5;
        } else {
          totalWin += effectiveAmount * 2;
        }
      }

      // Number Bet Logic
      if (bet.number !== null && bet.number === result.resultNumber) {
        totalWin += effectiveAmount * 9;
      }

      if (totalWin > 0) {
        user.wallet += Math.floor(totalWin);
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
  if (isRunning) return;
  isRunning = true;

  const gameCycle = async () => {
    await startNewRound();

    // 25s for placing bets
    await new Promise(resolve => setTimeout(resolve, 25000));

    await endCurrentRound();

    // 5s buffer before next round
    await new Promise(resolve => setTimeout(resolve, 5000));

    gameCycle(); // Recursive call to continue loop
  };

  gameCycle();
}

module.exports = { startGameLoop };
