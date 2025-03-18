const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate categories
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);