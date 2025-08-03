// gameLoop.js
const Round = require('./models/round');
const Bet = require('./models/bet');
const User = require('./models/user');
const generateResult = require('./utils/generateResult');

let isRunning = false;
let hasCleanedRounds = false;

async function cleanupRounds() {
  if (hasCleanedRounds) return;
  try {
    await Round.deleteMany({});
    console.log('🗑️ All old rounds cleaned up on server start.');
    hasCleanedRounds = true;
  } catch (error) {
    console.error('❌ Error cleaning rounds:', error);
  }
}

async function startNewRound() {
  const now = new Date();
  const roundId = `R-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  const newRound = new Round({
    roundId,
    startTime: now
  });

  await newRound.save();
  console.log(`✅ New Round Started: ${roundId}`);
  return newRound;
}

async function endRound(round) {
  const result = await generateResult(round.roundId);
  if (!result) return;

  round.resultNumber = result.number;
  round.resultColor = result.color;
  round.endTime = new Date();
  await round.save();

  console.log(`🎯 Round Result: ${round.roundId} -> Number: ${result.number}, Color: ${result.color}`);

  const bets = await Bet.find({ roundId: round.roundId });
  if (!bets.length) {
    console.log(`🛑 No bets placed for round ${round.roundId}`);
    return;
  }

  let totalWinners = 0;
  let totalDistributed = 0;

  for (const bet of bets) {
    const user = await User.findOne({ email: bet.email });
    if (!user) continue;

    const effectiveAmount = bet.amount * 0.98; // 2% Service Fee
    let winAmount = 0;

    // Color Bet Logic
    if (bet.colorBet) {
      if (bet.colorBet === 'Violet' && (result.number === 0 || result.number === 5)) {
        winAmount += effectiveAmount * 4.5;
      } else if (bet.colorBet === 'Red' && [1, 3, 7, 9].includes(result.number)) {
        winAmount += effectiveAmount * 2;
      } else if (bet.colorBet === 'Green' && [0, 2, 4, 6, 8].includes(result.number)) {
        winAmount += effectiveAmount * 2;
      }
    }

    // Number Bet Logic
    if (bet.numberBet != null && bet.numberBet === result.number) {
      winAmount += effectiveAmount * 9;
    }

    if (winAmount > 0) {
      user.wallet += Math.floor(winAmount);
      await user.save();
      bet.win = true;
      totalWinners += 1;
      totalDistributed += Math.floor(winAmount);
    } else {
      bet.win = false;
    }

    await bet.save();
  }

  console.log(`🏆 Round Summary: ${round.roundId} | Total Bets: ${bets.length} | Winners: ${totalWinners} | Distributed: ₹${totalDistributed}`);
}

function startGameLoop() {
  if (isRunning) return;
  isRunning = true;

  console.log('🔁 Starting Game Loop...');
  cleanupRounds();

  setInterval(async () => {
    try {
      const newRound = await startNewRound();
      await new Promise(resolve => setTimeout(resolve, 25000)); // 25s betting time
      await endRound(newRound);
    } catch (err) {
      console.error('❌ Game Loop Error:', err);
    }
  }, 30000); // 30s total loop
}

module.exports = { startGameLoop };
