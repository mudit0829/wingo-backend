const Round = require("./models/Round");
const Bet = require("./models/Bet");

function generateResult() {
  const choices = ["Red", "Green", "Violet"];
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

async function settleBets(roundId, result) {
  const bets = await Bet.find({ roundId });

  for (let bet of bets) {
    bet.status = bet.color === result ? "Win" : "Lose";
    await bet.save();
  }

  console.log(`🎯 Settled ${bets.length} bets for round ${roundId}`);
}

async function endLastRound() {
  const lastRound = await Round.findOne({ result: null }).sort({ startTime: -1 });

  if (!lastRound) return;

  const result = generateResult();
  lastRound.result = result;
  await lastRound.save();

  await settleBets(lastRound.roundId, result);

  console.log(`🏁 Round ${lastRound.roundId} ended with result: ${result}`);
}

async function createNewRound() {
  await endLastRound();

  const now = new Date();
  const endTime = new Date(now.getTime() + 30000);

  const round = new Round({
    roundId: Date.now().toString(),
    startTime: now,
    endTime,
    result: null
  });

  await round.save();
  console.log("🕑 New round created:", round.roundId);
}

function startGameLoop() {
  createNewRound();
  setInterval(createNewRound, 30000);
}

module.exports = { startGameLoop };
