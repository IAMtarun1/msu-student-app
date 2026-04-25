const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch events" });
    }
});

router.post("/", protect, async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: "Failed to create event" });
    }
});

module.exports = router;