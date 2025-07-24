const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/round', require('./routes/roundRoutes'));
app.use('/api/bet', require('./routes/betRoutes'));
app.use('/api/reset', require('./routes/resetRoute'));
app.use('/api/cron', require('./routes/cronRoutes'));

// ✅ Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
