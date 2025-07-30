const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/reset-test-users', async (req, res) => {
  try {
    const testUsers = [
      {
        username: 'test1',
        email: 'test1@example.com',
        password: '123456',
        role: 'user',
        wallet: 1000
      },
      {
        username: 'test2',
        email: 'test2@example.com',
        password: '123456',
        role: 'user',
        wallet: 1000
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        wallet: 1000
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      if (!existingUser) {
        await User.create({
          ...userData,
          password: hashedPassword
        });
      } else {
        existingUser.username = userData.username;
        existingUser.password = hashedPassword;
        existingUser.role = userData.role;
        existingUser.wallet = userData.wallet;
        await existingUser.save();
      }
    }

    res.json({ message: 'Test users created or updated successfully' });
  } catch (err) {
    console.error('Error creating test users:', err);
    res.status(500).json({ error: 'Failed to create test users' });
  }
});

module.exports = router;
