const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

dotenv.config();

async function reset() {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({});

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await User.create([
    { email: 'admin@example.com', password: adminPassword, balance: 10000 },
    { email: 'user@example.com', password: userPassword, balance: 1000 }
  ]);

  console.log('Test users reset');
  process.exit();
}

reset();
