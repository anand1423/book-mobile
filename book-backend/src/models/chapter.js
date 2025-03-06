const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    chapterId: { type: String, required: true, unique: true },
    bookId: { type: String, required: true, ref: "Book" },
    partId: { type: String, required: true, ref: "Part" },
    title: { type: String, required: true }, // Chapter Name
    text: { type: String, required: true }, // Chapter Content
    totalQuestions: { type: Number, default: 0 },
    questionsPerSession: { type: Number, default: 0 },
    order: { type: Number, required: true }, // Chapter Order
    passingPercentage: { type: Number, default: 80 }, // Default 80%
  },
  { timestamps: true }
);

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
