const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

router.get("/", authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json({ balance: user.balance });
  } catch (err) {
    console.error("Error fetching wallet:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
