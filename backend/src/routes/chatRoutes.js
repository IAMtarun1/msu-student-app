const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require("../middleware/authMiddleware");
const Chat = require("../models/Chat");

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.get("/history", protect, async (req, res) => {
    try {
        let chat = await Chat.findOne({ user: req.user._id });

        if (!chat) {
            chat = await Chat.create({
                user: req.user._id,
                messages: [],
            });
        }

        res.json(chat.messages);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chat history" });
    }
});

router.post("/message", protect, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ message: "Message is required" });
        }

        let chatDoc = await Chat.findOne({ user: req.user._id });

        if (!chatDoc) {
            chatDoc = await Chat.create({
                user: req.user._id,
                messages: [],
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction:
                "You are Hawk AI, a helpful assistant for international students at Montclair State University. Give clear, student-friendly answers about MSU campus life, CPT/OPT/F-1 general guidance, jobs, events, and student support. For immigration or legal questions, always remind students to confirm with CGCE/DSO.",
        });

        const geminiHistory = chatDoc.messages
            .filter((msg) => msg.sender === "user" || msg.sender === "bot")
            .map((msg) => ({
                role: msg.sender === "user" ? "user" : "model",
                parts: [{ text: msg.text }],
            }));

        const chat = model.startChat({
            history: geminiHistory,
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        chatDoc.messages.push(
            {
                sender: "user",
                text: message,
            },
            {
                sender: "bot",
                text: reply,
            }
        );

        const MAX_MESSAGES = 40;

        if (chatDoc.messages.length > MAX_MESSAGES) {
            chatDoc.messages = chatDoc.messages.slice(-MAX_MESSAGES);
        }

        await chatDoc.save();

        res.json({ reply });
    } catch (error) {
        console.error("Gemini full error:", error);
        res.status(500).json({
            message: "Hawk AI failed to respond",
            error: error.message,
        });
    }
});

router.delete("/history", protect, async (req, res) => {
    try {
        await Chat.findOneAndUpdate(
            { user: req.user._id },
            { messages: [] },
            { new: true, upsert: true }
        );

        res.json({ message: "Chat history cleared" });
    } catch (error) {
        res.status(500).json({ message: "Failed to clear chat history" });
    }
});

module.exports = router;