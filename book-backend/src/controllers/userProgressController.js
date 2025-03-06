const UserProgress = require("../models/userProgress");

// ✅ Create User Progress
exports.createUserProgress = async (req, res) => {
  try {
    const { userId, bookProgress } = req.body;
    const existingProgress = await UserProgress.findOne({ userId });

    if (existingProgress) {
      return res.status(400).json({ message: "User progress already exists" });
    }

    const newUserProgress = new UserProgress({ userId, bookProgress });
    await newUserProgress.save();
    res
      .status(201)
      .json({ message: "User progress created", data: newUserProgress });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// ✅ Get User Progress
exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }

    res.status(200).json({ data: userProgress });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update User Progress
exports.updateUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedProgress = await UserProgress.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }

    res.status(200).json({
      message: "User progress updated successfully",
      data: updatedProgress,
    });
  } catch (error) {
    console.error("Error updating user progress:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete User Progress
exports.deleteUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedProgress = await UserProgress.findOneAndDelete({ userId });

    if (!deletedProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }

    res.status(200).json({ message: "User progress deleted successfully" });
  } catch (error) {
    console.error("Error deleting user progress:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Mark Chapter as Completed
exports.markChapterCompleted = async (req, res) => {
  try {
    const { userId, bookId, chapterId } = req.params;

    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }

    const book = userProgress.bookProgress.find((b) => b.bookId === bookId);
    if (!book) {
      return res
        .status(404)
        .json({ message: "Book not found in user progress" });
    }

    if (!chapterId || typeof chapterId !== "string") {
      return res.status(400).json({ message: "Invalid chapter ID" });
    }

    if (!book.completedChapters.includes(chapterId)) {
      book.completedChapters.push(chapterId);
    }

    await userProgress.save();
    res
      .status(200)
      .json({ message: "Chapter marked as completed", data: userProgress });
  } catch (error) {
    console.error("Error marking chapter as completed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update Quiz Result
exports.updateQuizResult = async (req, res) => {
  try {
    const { userId, bookId, quizId } = req.params;
    const { score, completed, answers } = req.body;

    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }

    const book = userProgress.bookProgress.find((b) => b.bookId === bookId);
    if (!book) {
      return res
        .status(404)
        .json({ message: "Book not found in user progress" });
    }

    const quizIndex = book.quizResults.findIndex((q) => q.quizId === quizId);
    if (quizIndex === -1) {
      book.quizResults.push({
        quizId,
        score,
        completed,
        answers,
        completedAt: new Date(),
      });
    } else {
      book.quizResults[quizIndex] = {
        quizId,
        score,
        completed,
        answers,
        completedAt: new Date(),
      };
    }

    await userProgress.save();
    res
      .status(200)
      .json({ message: "Quiz result updated", data: userProgress });
  } catch (error) {
    console.error("Error updating quiz result:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
