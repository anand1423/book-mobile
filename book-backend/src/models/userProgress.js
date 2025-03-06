const mongoose = require("mongoose");

const UserProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    bookProgress: [
      {
        bookId: { type: String, required: true },
        completedChapters: [{ type: String }],
        quizResults: [
          {
            quizId: { type: String, required: true },
            score: { type: Number, required: true, min: 0 },
            completed: { type: Boolean, required: true },
            completedAt: { type: Date, default: Date.now },
            answers: [
              {
                questionId: { type: String, required: true },
                selectedOptionId: { type: String, required: true },
                isCorrect: { type: Boolean, required: true },
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const UserProgress = mongoose.model("UserProgress", UserProgressSchema);

module.exports = UserProgress;
