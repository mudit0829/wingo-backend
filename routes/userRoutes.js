const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Get wallet balance by username
router.get("/wallet/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ wallet: user.wallet });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
