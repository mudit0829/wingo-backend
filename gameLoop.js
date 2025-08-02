const Round = require('./models/round');
const Bet = require('./models/bet');
const User = require('./models/user');
const generateResult = require('./utils/generateResult');

let isRunning = false;
let hasCleanedRounds = false;  // Flag to ensure cleanup runs only once

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
    timestamp: now
  });

  await newRound.save();
  console.log(`✅ New Round Started: ${roundId}`);
  return newRound;
}

async function endRound(round) {
  const result = await generateResult(round.roundId);
  if (!result) return;

  // Update Round with Result
  round.resultNumber = result.number;
  round.resultColor = result.color;
  round.timestamp = new Date();
  await round.save();

  console.log(`🎯 Round Result Updated: ${round.roundId} -> ${result.number} ${result.color}`);

  // Process Bets
  const bets = await Bet.find({ roundId: round.roundId });
  if (!bets.length) {
    console.log(`🛑 No bets placed for round ${round.roundId}`);
    return;
  }

  for (const bet of bets) {
    const user = await User.findOne({ email: bet.email });
    if (!user) continue;

    const effectiveAmount = bet.amount * 0.98; // 2% service fee
    let winAmount = 0;

    // Color Bet
    if (bet.colorBet && bet.colorBet === result.color) {
      if (bet.colorBet === 'Violet') {
        winAmount += effectiveAmount * 4.5;
      } else if (result.number === 0 || result.number === 5) {
        winAmount += effectiveAmount * 1.5;
      } else {
        winAmount += effectiveAmount * 2;
      }
    }

    // Number Bet
    if (bet.numberBet !== null && bet.numberBet === result.number) {
      winAmount += effectiveAmount * 9;
    }

    // Update User Wallet if Won
    if (winAmount > 0) {
      user.wallet += Math.floor(winAmount);
      await user.save();
      console.log(`💰 User ${user.email} won ₹${Math.floor(winAmount)} in round ${round.roundId}`);
      bet.win = true;
    } else {
      bet.win = false;
    }

    await bet.save();
  }
}

function startGameLoop() {
  if (isRunning) return;
  isRunning = true;

  console.log('🔁 Starting Game Loop...');

  cleanupRounds();  // 🧹 Clean old rounds at startup (only once)

  setInterval(async () => {
    try {
      const newRound = await startNewRound();

      // Wait 25s for bets
      await new Promise(resolve => setTimeout(resolve, 25000));

      await endRound(newRound);

      // Wait 5s buffer before next round (implicit in 30s interval)
    } catch (err) {
      console.error('❌ Game Loop Error:', err);
    }
  }, 30000); // Total loop cycle 30s
}

module.exports = { startGameLoop };
