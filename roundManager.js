// roundManager.js
const Round = require("./models/Round");
const Bet = require("./models/Bet");

function getRandomResult() {
  const options = ["Red", "Green", "Violet"];
  const random = Math.floor(Math.random() * 100);

  if (random < 45) return "Red";
  if (random < 90) return "Green";
  return "Violet";
}

async function evaluateBets(roundId, resultColor) {
  const bets = await Bet.find({ roundId });

  for (let bet of bets) {
    bet.status = bet.color === resultColor ? "Won" : "Lost";
    bet.resultColor = resultColor;
    await bet.save();
  }
}

async function startNewRound() {
  const now = new Date();
  const roundId = now.getTime().toString();

  const round = new Round({
    roundId,
    startTime: now,
    endTime: new Date(now.getTime() + 30000), // 30 seconds round
  });

  await round.save();

  console.log(`🕒 New round started: ${roundId}`);

  setTimeout(async () => {
    const resultColor = getRandomResult();
    round.result = resultColor;
    await round.save();

    await evaluateBets(roundId, resultColor);
    console.log(`✅ Round ${roundId} ended with result: ${resultColor}`);
  }, 30000);
}

function runRoundScheduler() {
  startNewRound();
  setInterval(startNewRound, 30000); // every 30 seconds
}

module.exports = runRoundScheduler;
