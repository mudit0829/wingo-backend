// routes/roundRoutes.js
const express = require('express');
const router = express.Router();
const Round = require('../models/round');

router.get('/', async (req, res) => {
  try {
    const rounds = await Round.find().sort({ startTime: -1 }).limit(20);
    res.json(rounds);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


// utils/generateResult.js
const Result = require('../models/result');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function calculateColor(resultNumber) {
  if (resultNumber === 5 || resultNumber === 0) return 'Violet';
  if ([1, 3, 7, 9].includes(resultNumber)) return 'Green';
  if ([2, 4, 6, 8].includes(resultNumber)) return 'Red';
  return null;
}

async function generateResult(roundId) {
  try {
    const resultNumber = getRandomInt(10);
    const resultColor = calculateColor(resultNumber);

    return { number: resultNumber, color: resultColor };
  } catch (error) {
    console.error('❌ Error generating result:', error);
    return null;
  }
}

module.exports = generateResult;


// gameLoop.js
const Round = require('./models/round');
const Bet = require('./models/bet');
const User = require('./models/user');
const generateResult = require('./utils/generateResult');

let isRunning = false;
let hasCleanedRounds = false;

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
    startTime: now
  });

  await newRound.save();
  console.log(`✅ New Round Started: ${roundId}`);
  return newRound;
}

async function endRound(round) {
  const result = await generateResult(round.roundId);
  if (!result) return;

  round.resultNumber = result.number;
  round.resultColor = result.color;
  round.endTime = new Date();
  await round.save();

  console.log(`🎯 Round Result Updated: ${round.roundId} -> ${result.number} ${result.color}`);

  const bets = await Bet.find({ roundId: round.roundId });
  if (!bets.length) {
    console.log(`🛑 No bets placed for round ${round.roundId}`);
    return;
  }

  for (const bet of bets) {
    const user = await User.findOne({ email: bet.email });
    if (!user) continue;

    const effectiveAmount = bet.amount * 0.98;
    let winAmount = 0;

    if (bet.colorBet && bet.colorBet === result.color) {
      if (bet.colorBet === 'Violet') {
        winAmount += effectiveAmount * 4.5;
      } else if (result.number === 0 || result.number === 5) {
        winAmount += effectiveAmount * 1.5;
      } else {
        winAmount += effectiveAmount * 2;
      }
    }

    if (bet.numberBet != null && bet.numberBet === result.number) {
      winAmount += effectiveAmount * 9;
    }

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

  cleanupRounds();

  setInterval(async () => {
    try {
      const newRound = await startNewRound();
      await new Promise(resolve => setTimeout(resolve, 25000));
      await endRound(newRound);
    } catch (err) {
      console.error('❌ Game Loop Error:', err);
    }
  }, 30000);
}

module.exports = { startGameLoop };


// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const betRoutes = require('./routes/betRoutes');
const roundRoutes = require('./routes/roundRoutes');
const userRoutes = require('./routes/userRoutes');
const cronRoutes = require('./routes/cronRoutes');
const adminResetRoute = require('./routes/adminResetRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://mudit0829.github.io'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/reset', adminResetRoute);

app.get('/', (req, res) => {
  res.send('✅ WinGo Backend is running');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);

    const { startGameLoop } = require('./gameLoop');
    startGameLoop();
  });

}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
});
