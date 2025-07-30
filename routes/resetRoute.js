const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/reset-test-users', async (req, res) => {
  try {
    await User.deleteMany({}); // Clear all users

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await User.create([
      { email: 'admin@example.com', password: adminPassword, balance: 10000 },
      { email: 'user@example.com', password: userPassword, balance: 1000 }
    ]);

    res.json({ message: 'Test users reset' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed' });
  }
});

module.exports = router;
