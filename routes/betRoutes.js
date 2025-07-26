const express = require("express");
const router = express.Router();
const { placeBet, getAllBets } = require("../controllers/betController");
const authenticate = require("../middleware/authenticate");

router.post("/", authenticate, placeBet);
router.get("/", authenticate, getAllBets);

module.exports = router;
