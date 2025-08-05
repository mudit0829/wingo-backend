const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Round = require('../models/round');

dotenv.config();

async function generateFutureRounds() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const now = new Date();
  const rounds = [];

  for (let i = 0; i < 1000; i++) {
    const futureTime = new Date(now.getTime() + i * 30000); // every 30 seconds
    const yyyyMMdd = futureTime.toISOString().split('T')[0].replace(/-/g, '');
    const suffix = String(Math.floor(futureTime.getTime() / 1000)).slice(-5);
    const roundId = `R-${yyyyMMdd}-${suffix}`;

    rounds.push({
      roundId,
      startTime: futureTime,
      resultNumber: null,
      resultColor: null
    });
  }

  await Round.deleteMany({}); // Clear existing rounds
  await Round.insertMany(rounds);
  console.log(`✅ Inserted ${rounds.length} upcoming rounds`);
  mongoose.disconnect();
}

generateFutureRounds();
