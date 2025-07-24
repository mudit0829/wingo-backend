const Round = require("../models/Round");
const Bet = require("../models/Bet");

const generateAndSaveResult = async () => {
  const round = await Round.findOne({ result: null }).sort({ roundId: -1 });

  if (!round) throw new Error("No active round found");

  const resultNumber = Math.floor(Math.random() * 10).toString(); // 0-9
  round.result = resultNumber;
  await round.save();

  const bets = await Bet.find({ roundId: round.roundId });

  for (let bet of bets) {
    const netAmount = bet.amount * 0.98; // 2% service fee

    if (bet.betType === "COLOR") {
      let win = false;

      if (resultNumber === "5" && bet.choice === "VIOLET") {
        win = true;
        bet.winningAmount = netAmount * 4.5;
      } else if (["1", "3", "7", "9"].includes(resultNumber) && bet.choice === "RED") {
        win = true;
        bet.winningAmount = netAmount * 2;
      } else if (["0", "2", "4", "6", "8"].includes(resultNumber) && bet.choice === "GREEN") {
        win = true;
        bet.winningAmount = netAmount * 2;
      } else {
        bet.winningAmount = 0;
      }

    } else if (bet.betType === "NUMBER") {
      if (bet.choice === resultNumber) {
        bet.winningAmount = netAmount * 9;
      } else {
        bet.winningAmount = 0;
      }
    }

    await bet.save();
  }

  return resultNumber;
};

module.exports = generateAndSaveResult;
