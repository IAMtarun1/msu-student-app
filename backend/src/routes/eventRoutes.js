const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/authMiddleware");

function validateEventInput(req, res, next) {
    const { title, date, time, location } = req.body;

    if (!title || !date || !time || !location) {
        return res.status(400).json({
            message: "Title, date, time, and location are required",
        });
    }

    next();
}

router.get("/", protect, async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch events" });
    }
});

router.post("/", protect, adminOnly, validateEventInput, async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: "Failed to create event" });
    }
});

router.put("/:id", protect, adminOnly, validateEventInput, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Failed to update event" });
    }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete event" });
    }
});

router.post("/:id/rsvp", protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (!event.rsvps) {
            event.rsvps = [];
        }

        const userId = req.user._id.toString();

        const alreadyRsvped = event.rsvps.some(
            (id) => id.toString() === userId
        );

        if (alreadyRsvped) {
            event.rsvps = event.rsvps.filter(
                (id) => id.toString() !== userId
            );
        } else {
            event.rsvps.push(req.user._id);
        }

        await event.save();

        res.json({
            message: alreadyRsvped ? "RSVP removed" : "RSVP confirmed",
            rsvps: event.rsvps.map((id) => id.toString()),
            rsvpCount: event.rsvps.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update RSVP" });
    }
});

module.exports = router;