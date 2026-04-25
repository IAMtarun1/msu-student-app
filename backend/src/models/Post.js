const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const postSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        tag: {
            type: String,
            default: "New",
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [commentSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);