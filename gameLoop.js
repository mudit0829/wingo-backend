const Round = require("./models/Round");

let roundCounter = 1;

const startNewRound = async () => {
  const existing = await Round.findOne().sort({ roundId: -1 });
  roundCounter = existing ? existing.roundId + 1 : 1;

  const round = new Round({ roundId: roundCounter });
  await round.save();
  console.log("Started new round:", roundCounter);
};

module.exports = startNewRound;
