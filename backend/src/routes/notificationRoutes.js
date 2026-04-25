const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user._id,
        })
            .populate("sender", "fullName")
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
});

router.put("/:id/read", protect, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { read: true },
            { new: true }
        );

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: "Failed to update notification" });
    }
});

router.get("/unread-count", protect, async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            read: false,
        });

        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch unread count" });
    }
});

router.put("/mark-all-read", protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { read: true }
        );

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Failed to mark all as read" });
    }
});

module.exports = router;