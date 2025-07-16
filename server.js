// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/authRoutes'));
// ... your other routes

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server & DB connected')
    );
  })
  .catch(console.error);
