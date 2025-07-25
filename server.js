const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const cronRoutes = require('./routes/cronRoutes');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS SETUP
app.use(cors({
  origin: '*', // replace '*' with your actual frontend domain for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ ROUTES
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/cron', cronRoutes);

app.get('/api/health', (req, res) => {
  res.send('API is running');
});

// ✅ SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
