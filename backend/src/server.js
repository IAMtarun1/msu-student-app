const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://msu-student-app.vercel.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

const jobRoutes = require("./routes/jobRoutes");
app.use("/api/jobs", jobRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("MSU Student App API is running");
});

app.get("/api/health", (req, res) => {
    res.json({ message: "Backend is healthy" });
});

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

const communityRoutes = require("./routes/communityRoutes");
app.use("/api/community", communityRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("MongoDB connection error:", error.message));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
