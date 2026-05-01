const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

function createToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

function formatUser(user) {
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        country: user.country,
        profileImage: user.profileImage,
        role: user.role,
    };
}

router.post("/register", async (req, res) => {
    try {
        const { fullName, email, password, country } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Please fill all required fields",
            });
        }

        const emailRegex = /^[^\s@]+@montclair\.edu$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please use a valid Montclair State email address",
            });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters and include one uppercase letter and one number",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            country,
            isVerified: true,
        });

        const token = createToken(user);

        res.status(201).json({
            message: "Account created successfully",
            token,
            user: formatUser(user),
        });
    } catch (error) {
        res.status(500).json({
            message: "Register failed",
            error: error.message,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = createToken(user);

        res.json({
            message: "Login successful",
            token,
            user: formatUser(user),
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message,
        });
    }
});

router.get("/me", protect, async (req, res) => {
    res.json(req.user);
});

router.put("/profile", protect, async (req, res) => {
    try {
        const { fullName, country, profileImage } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { fullName, country, profileImage },
            { new: true }
        ).select("-password");

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Profile update failed",
        });
    }
});

module.exports = router;