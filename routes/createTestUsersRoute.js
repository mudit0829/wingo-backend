const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Temporary route to create test users
router.get('/', async (req, res) => {
  try {
    const users = [
      {
        username: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        wallet: 1000
      },
      {
        username: 'test2@example.com',
        password: '123456',
        role: 'user',
        wallet: 500
      }
    ];

    for (const userData of users) {
      const existing = await User.findOne({ username: userData.username });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({
          username: userData.username,
          password: hashedPassword,
          role: userData.role,
          wallet: userData.wallet
        });
        await newUser.save();
      }
    }

    res.json({ message: 'Test users created or already exist.' });
  } catch (err) {
    console.error('Error creating test users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
