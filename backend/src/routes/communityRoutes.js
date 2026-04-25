const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { protect } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

function formatPost(post) {
    return {
        id: post._id,
        text: post.text,
        tag: post.tag,
        likes: post.likedBy.length,
        likedBy: post.likedBy.map((id) => id.toString()),
        name: post.author?.fullName || "Unknown User",
        country: post.author?.country || "Unknown",
        program: "Computer Science MS",
        comments: post.comments.map((comment) => ({
            id: comment._id,
            text: comment.text,
            user: comment.user?.fullName || "Unknown User",
            createdAt: comment.createdAt,
        })),
    };
}

router.get("/posts", protect, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "fullName country")
            .populate("comments.user", "fullName")
            .sort({ createdAt: -1 });

        res.json(posts.map(formatPost));
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});

router.post("/posts", protect, async (req, res) => {
    try {
        if (!req.body.text?.trim()) {
            return res.status(400).json({ message: "Post text is required" });
        }

        const post = await Post.create({
            text: req.body.text,
            author: req.user._id,
            tag: "New",
        });

        const populatedPost = await Post.findById(post._id)
            .populate("author", "fullName country")
            .populate("comments.user", "fullName");

        res.status(201).json(formatPost(populatedPost));
    } catch (error) {
        res.status(500).json({ message: "Failed to create post" });
    }
});

router.post("/posts/:id/like", protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.user._id.toString();
        const alreadyLiked = post.likedBy.some((id) => id.toString() === userId);

        if (alreadyLiked) {
            post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
        } else {
            post.likedBy.push(req.user._id);
        }

        await post.save();

        if (!alreadyLiked && post.author.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipient: post.author,
                sender: req.user._id,
                type: "like",
                message: `${req.user.fullName} liked your post`,
                post: post._id,
            });
        }

        res.json({
            message: alreadyLiked ? "Post unliked" : "Post liked",
            likes: post.likedBy.length,
            likedBy: post.likedBy.map((id) => id.toString()),
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to like post" });
    }
});

router.post("/posts/:id/comment", protect, async (req, res) => {
    try {
        if (!req.body.text?.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({
            text: req.body.text,
            user: req.user._id,
        });

        await post.save();

        if (post.author.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipient: post.author,
                sender: req.user._id,
                type: "comment",
                message: `${req.user.fullName} commented on your post`,
                post: post._id,
            });
        }

        const populatedPost = await Post.findById(post._id)
            .populate("author", "fullName country")
            .populate("comments.user", "fullName");

        res.json(formatPost(populatedPost));
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment" });
    }
});

module.exports = router;