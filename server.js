const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet'); // ✅ Security (optional)

// Route imports
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const betRoutes = require('./routes/betRoutes');
const roundRoutes = require('./routes/roundRoutes');
const resultRoutes = require('./routes/resultRoutes');
const walletRoutes = require('./routes/walletRoutes');
const userRoutes = require('./routes/userRoutes');
const cronRoutes = require('./routes/cronRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet()); // ✅ Optional security headers
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      if (buf.length > 0) JSON.parse(buf);
    } catch (err) {
      err.statusCode = 400;
      err.body = buf.toString();
      throw err;
    }
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cron', cronRoutes);

console.log('✅ All routes loaded');

// JSON error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.statusCode === 400 && 'body' in err) {
    console.error('❌ Invalid JSON received:', err.body);
    return res.status(400).json({ error: 'Invalid JSON payload' }
