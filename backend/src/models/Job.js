const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        org: { type: String, required: true },
        type: { type: String, required: true },
        cpt: { type: Boolean, default: false },
        tags: [{ type: String }],
        pay: { type: String },
        description: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);