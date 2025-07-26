const express = require("express");
const router = express.Router();
const { placeBet } = require("../controllers/betController");
const authenticate = require("../middleware/authenticate");

router.post("/place", authenticate, placeBet);

module.exports = router;
