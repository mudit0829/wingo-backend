const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Error handler for bad JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bets', require('./routes/betRoutes'));
app.use('/api/rounds', require('./routes/roundRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reset', require('./routes/resetRoute'));
app.use('/api/cron', require('./routes/cronRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// Default route
app.get('/', (req, res) => {
  res.send('WinGo backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
