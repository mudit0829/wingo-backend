const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getWallet,
} = require("../controllers/userController");

const authenticate = require("../middleware/authenticate");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Wallet route (requires JWT token)
router.get("/wallet", authenticate, getWallet);

module.exports = router;
