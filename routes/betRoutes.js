const express = require("express");
const router = express.Router();
const Bet = require("../models/bet");

router.post("/", async (req, res) => {
    try {
        const bet = new Bet(req.body);
        await bet.save();
        res.status(201).json(bet);
    } catch (error) {
        res.status(400).json({ message: "Bet failed" });
    }
});

module.exports = router;