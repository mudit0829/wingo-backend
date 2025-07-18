const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Round = require('../models/Round');

async function fix() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const rounds = await Round.find();
  for (let rd of rounds) {
    if (!rd.roundId) rd.roundId = rd._id.getTimestamp().getTime().toString();
    if (!rd.timestamp) rd.timestamp = rd._id.getTimestamp();
    await rd.save();
  }

  console.log('✅ Fixed round IDs and timestamps');
  process.exit();
}

fix().catch(err => { console.error(err); process.exit(1); });
