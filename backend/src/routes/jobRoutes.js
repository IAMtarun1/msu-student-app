const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const { protect, adminOnly } = require("../middleware/authMiddleware");

function validateJobInput(req, res, next) {
    const { title, org, applicationLink } = req.body;

    if (!title || !org || !applicationLink) {
        return res.status(400).json({
            message: "Title, organization, and application link are required",
        });
    }

    if (
        !applicationLink.startsWith("http://") &&
        !applicationLink.startsWith("https://")
    ) {
        return res.status(400).json({
            message: "Application link must start with http:// or https://",
        });
    }

    next();
}

router.get("/", protect, async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
});

router.post("/", protect, adminOnly, validateJobInput, async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: "Failed to create job" });
    }
});

router.put("/:id", protect, adminOnly, validateJobInput, async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: "Failed to update job" });
    }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete job" });
    }
});

module.exports = router;