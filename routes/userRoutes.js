const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getWallet,
} = require("../controllers/userController");

const authenticate = require("../middleware/authenticate");

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// Wallet (protected)
router.get("/wallet", authenticate, getWallet);

module.exports = router;
