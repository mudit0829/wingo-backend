const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const betRoutes = require('./routes/betRoutes');
const roundRoutes = require('./routes/roundRoutes');
const resultRoutes = require('./routes/resultRoutes'); // ✅ Add this if not present
const walletRoutes = require('./routes/walletRoutes');
const userRoutes = require('./routes/userRoutes'); // Optional, if used

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/bet', betRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/results', resultRoutes); // ✅ THIS MUST BE PRESENT
app.use('/api/wallet', walletRoutes);
app.use('/api/users', userRoutes); // Optional

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('WingGo Backend is running!');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
