const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getWallet,
} = require("../controllers/userController");

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get wallet balance by username (public)
router.get("/wallet/:username", getWallet);

module.exports = router;
