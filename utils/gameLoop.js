const Round = require('../models/round');
const Bet = require('../models/bet');
const User = require('../models/user');
const generateResult = require('./generateResult');

const gameLoop = async () => {
  try {
    const currentRound = await Round.findOne().sort({ roundId: -1 });

    if (!currentRound) return;

    const roundId = currentRound.roundId;
    const roundTimestamp = currentRound.timestamp;

    // Generate random result
    const result = generateResult();

    // Update round with result
    currentRound.result = result;
    await currentRound.save();

    // Fetch all bets placed for this round
    const bets = await Bet.find({ roundId });

    for (const bet of bets) {
      const user = await User.findOne({ email: bet.userEmail });
      if (!user) continue;

      let payout = 0;

      // Apply 2% service fee
      const effectiveColorAmount = bet.colorAmount * 0.98;
      const effectiveNumberAmount = bet.numberAmount * 0.98;

      // Color payout
      if (bet.color && ['red', 'green', 'violet'].includes(bet.color)) {
        const color = bet.color.toLowerCase();

        if (color === 'green' && ['1', '3', '7', '9'].includes(result)) {
          payout += effectiveColorAmount * 2;
        } else if (color === 'green' && result === '5') {
          payout += effectiveColorAmount * 1.5;
        } else if (color === 'red' && ['2', '4', '6', '8'].includes(result)) {
          payout += effectiveColorAmount * 2;
        } else if (color === 'red' && result === '0') {
          payout += effectiveColorAmount * 1.5;
        } else if (color === 'violet' && ['0', '5'].includes(result)) {
          payout += effectiveColorAmount * 4.5;
        }
      }

      // Number payout
      if (bet.number === result) {
        payout += effectiveNumberAmount * 9;
      }

      // Update user wallet
      if (payout > 0) {
        user.wallet += payout;
        await user.save();
      }

      // Mark bet as processed
      bet.result = result;
      bet.payout = payout;
      await bet.save();
    }
  } catch (err) {
    console.error('Error in game loop:', err);
  }
};

module.exports = gameLoop;
