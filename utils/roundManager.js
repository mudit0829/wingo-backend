// utils/roundManager.js
const Round = require("../models/round");
const Bet = require("../models/bet");
const User = require("../models/user");
const generateResult = require("./generateResult");

const ROUND_DURATION_MS = 30000;

let currentRound = null;

const createNewRound = async () => {
  try {
    const now = new Date();
    const roundId = `R-${now.toISOString().slice(0,19).replace(/[-T:]/g,"")}`;

    // Generate Result
    const result = await generateResult(roundId);

    // Save round with result
    const round = new Round({
      roundId,
      startTime: now,
      resultNumber: result.number,
      resultColor: result.color
    });

    const savedRound = await round.save();
    currentRound = savedRound;

    console.log("✅ New Round Started:", savedRound.roundId);
    console.log(`🎯 Round Result: ${savedRound.roundId} -> Number: ${savedRound.resultNumber}, Color: ${savedRound.resultColor}`);

    // Process Bets & Distribute Winnings
    await processBets(savedRound);

    return savedRound;
  } catch (err) {
    console.error("❌ Error creating round:", err);
  }
};

const processBets = async (round) => {
  try {
    const bets = await Bet.find({ roundId: round.roundId });
    if (bets.length === 0) {
      console.log(`🏆 Round Summary: ${round.roundId} | No bets placed.`);
      return;
    }

    let winners = 0;
    let distributed = 0;

    for (const bet of bets) {
      let won = false;

      // Color Bet
      if (bet.colorBet && bet.colorBet === round.resultColor) {
        won = true;
        let payout = bet.netAmount * (bet.colorBet === 'Violet' ? 4.5 : 2);
        await User.updateOne({ email: bet.email }, { $inc: { wallet: payout } });
        distributed += payout;
      }

      // Number Bet
      if (bet.numberBet !== null && bet.numberBet === round.resultNumber) {
        won = true;
        let payout = bet.netAmount * 9;
        await User.updateOne({ email: bet.email }, { $inc: { wallet: payout } });
        distributed += payout;
      }

      bet.win = won;
      await bet.save();

      if (won) winners++;
    }

    console.log(`🏆 Round Summary: ${round.roundId} | Total Bets: ${bets.length} | Winners: ${winners} | Distributed: ₹${distributed}`);
  } catch (err) {
    console.error(`❌ Error processing bets for round ${round.roundId}:`, err);
  }
};

const getCurrentRound = () => {
  return currentRound;
};

const startRoundTimer = async () => {
  await createNewRound(); // Start with first round immediately

  setInterval(async () => {
    await createNewRound();
  }, ROUND_DURATION_MS);
};

module.exports = {
  createNewRound,
  getCurrentRound,
  startRoundTimer,
};
