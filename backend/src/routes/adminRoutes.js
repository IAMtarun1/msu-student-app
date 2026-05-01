const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Job = require("../models/Job");
const Event = require("../models/Event");
const Post = require("../models/Post");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/stats", protect, adminOnly, async (req, res) => {
    try {
        const [users, jobs, events, posts] = await Promise.all([
            User.countDocuments(),
            Job.countDocuments(),
            Event.countDocuments(),
            Post.countDocuments(),
        ]);

        res.json({
            users,
            jobs,
            events,
            posts,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to load admin stats" });
    }
});

module.exports = router;