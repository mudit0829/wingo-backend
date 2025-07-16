const Round = require("./models/Round");
const Bet = require("./models/Bet");

function getRandomResult() {
  const rand = Math.floor(Math.random() * 100);
  if (rand < 45) return "Red";
  if (rand < 90) return "Green";
  return "Violet";
}

async function evaluateBets(roundId, resultColor) {
  const bets = await Bet.find({ roundId });
  for (let b of bets) {
    b.status = b.color === resultColor ? "Won" : "Lost";
    b.resultColor = resultColor;
    await b.save();
  }
}

async function startNewRound() {
  const id = Date.now().toString();
  const round = new Round({ roundId: id, startTime: new Date(), endTime: new Date(Date.now() + 30000) });
  await round.save();
  setTimeout(async () => {
    const result = getRandomResult();
    round.result = result;
    await round.save();
    await evaluateBets(round.roundId, result);
    console.log(`✔️ Round ${round.roundId} ended with ${result}`);
  }, 30000);
}

function runRoundScheduler() {
  startNewRound();
  setInterval(startNewRound, 30000);
}

module.exports = runRoundScheduler;
