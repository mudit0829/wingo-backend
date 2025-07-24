const express = require('express');
const router = express.Router();

// Test Route to confirm server is working
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'API is running 🚀' });
});

module.exports = router;
