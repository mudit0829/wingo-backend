const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  const user = await User.create({ username, password, balance: 0, role: 'user' });
  res.json({ message: 'Registration successful' });
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ username: user.username, token });
});

module.exports = { registerUser, loginUser };
