// scripts/deleteRounds.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Round = require('../models/Round');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Round.deleteMany({});
    console.log('✅ All rounds deleted');
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ Error:', err));
