const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const betRoutes = require('./routes/betRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

mongoose
  .connect('your_mongodb_connection_string_here', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

app.use('/api', authRoutes);
app.use('/api', betRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
