const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true, unique: true },
    chapterId: { type: String, required: true, ref: "Chapter" },
    questionText: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["TrueFalse", "Single", "Multiple"], // Restricts to valid types
      required: true,
    },
    options: [{ type: String, required: true }], // List of answer choices
    correctAnswers: [{ type: String, required: true }], // Stores indexes of correct answers
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
