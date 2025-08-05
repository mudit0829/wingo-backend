const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Round = require('../models/round');

dotenv.config();

async function generateFutureRounds() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const now = new Date();
  const rounds = [];

  for (let i = 1; i <= 1000; i++) {
    rounds.push({
      roundId: `R${(i).toString().padStart(4, '0')}`,
      startTime: new Date(now.getTime() + i * 30000), // every 30 seconds
      resultNumber: null,
      resultColor: null
    });
  }

  await Round.insertMany(rounds);
  console.log(`✅ Inserted ${rounds.length} upcoming rounds`);
  mongoose.disconnect();
}

generateFutureRounds();
