const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
});

router.post("/", protect, async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: "Failed to create job" });
    }
});

module.exports = router;