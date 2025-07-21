const Round = require('../models/Round');
const Bet = require('../models/Bet');

function calculateResult() {
    const options = ['Red', 'Green', 'Violet'];
    return options[Math.floor(Math.random() * options.length)];
}

async function generateAndSaveResult() {
    const latestRound = await Round.findOne().sort({ timestamp: -1 });
    if (!latestRound || latestRound.result) throw new Error("No round or result already generated");

    const result = calculateResult();
    latestRound.result = result;
    await latestRound.save();

    return { roundId: latestRound.roundId, result };
}

module.exports = generateAndSaveResult;
