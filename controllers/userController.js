const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user"); // ✅ lowercase filename

// GET /api/wallet
const getWallet = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ balance: user.balance });
});

// Other exports like registerUser, loginUser...

module.exports = {
  // existing exports
  getWallet,
};
