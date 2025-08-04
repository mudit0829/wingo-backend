const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Round = require('../models/round');

dotenv.config();

async function generateRounds() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('Connected to MongoDB');

  const rounds = [];
  const startTime = new Date();

  for (let i = 1; i <= 1000; i++) {
    const roundId = `R${i.toString().padStart(4, '0')}`;
    const time = new Date(startTime.getTime() + (i * 30 * 1000)); // Every 30 seconds

    rounds.push({
      roundId,
      startTime: time,
      resultColor: null,
      resultNumber: null
    });
  }

  await Round.insertMany(rounds);
  console.log('1000 Rounds Generated Successfully');

  mongoose.disconnect();
}

generateRounds();
