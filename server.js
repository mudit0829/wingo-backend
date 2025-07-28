const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Route imports
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const betRoutes = require('./routes/betRoutes');
const roundRoutes = require('./routes/roundRoutes');
const resultRoutes = require('./routes/resultRoutes');
const walletRoutes = require('./routes/walletRoutes');
const userRoutes = require('./routes/userRoutes');
const cronRoutes = require('./routes/cronRoutes'); // ✅ Add this line

dotenv.config();

const app = express();

// CORS middleware
app.use(cors());

// JSON parser with error handling
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cron', cronRoutes); // ✅ Register the cron route

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.statusCode === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
