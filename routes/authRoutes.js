const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, wallet: 0 }); // Default wallet 0
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // ✅ FIX: Sign token with `id` so middleware works
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,   // ✅ Use env secret
      { expiresIn: '3h' }
    );

    res.json({
      token,
      user: {
        email: user.email,
        wallet: user.wallet  // ✅ use correct field name from DB
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login error' });
  }
});

module.exports = router;
