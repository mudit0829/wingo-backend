// gameEngine.js
const Round = require('./models/Round');
const Bet = require('./models/Bet');

const colors = ["Red", "Green", "Violet"];

async function createRound() {
  const newRound = new Round({ result: null, startTime: new Date() });
  await newRound.save();
  console.log("New round started:", newRound._id);
  return newRound;
}

async function generateResultAndUpdateBets() {
  const round = await Round.findOne({ result: null }).sort({ startTime: -1 });
  if (!round) return;

  const result = colors[Math.floor(Math.random() * colors.length)];
  round.result = result;
  await round.save();

  const bets = await Bet.find({ roundId: round._id });
  for (let bet of bets) {
    bet.resultColor = result;
    bet.status = bet.color === result ? "win" : "lose";
    await bet.save();
  }

  console.log(`Result for round ${round._id}: ${result}`);
}

async function gameLoop() {
  while (true) {
    const round = await createRound();

    // wait 30 seconds
    await new Promise(res => setTimeout(res, 30000));

    await generateResultAndUpdateBets();
  }
}

module.exports = { gameLoop };
