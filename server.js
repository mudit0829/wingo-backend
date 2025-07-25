const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const cronRoutes = require('./routes/cronRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ✅ Manual CORS fix
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow any origin or set specific
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/cron', cronRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
