const Question = require("../models/question");
const Chapter = require("../models/chapter");

/**
 * @desc    Get all questions
 * @route   GET /questions
 */
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().lean();
    res.status(200).json(questions);
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Get a single question by questionId
 * @route   GET /questions/:questionId
 */
exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findOne({ questionId }).lean();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error(`❌ Error fetching question ${questionId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Create a new question
 * @route   POST /questions
 */
exports.createQuestion = async (req, res) => {
  try {
    const {
      questionId,
      chapterId,
      questionText,
      questionType,
      options,
      correctAnswers,
    } = req.body;

    // Check if the question ID already exists
    const existingQuestion = await Question.findOne({ questionId }).lean();
    if (existingQuestion) {
      return res.status(400).json({ message: "Question already exists" });
    }

    // Validate chapterId before inserting the question
    const chapterExists = await Chapter.findOne({ chapterId }).lean();
    if (!chapterExists) {
      return res.status(400).json({ message: "Invalid chapterId" });
    }

    // Create new question
    const newQuestion = new Question({
      questionId,
      chapterId,
      questionText,
      questionType,
      options,
      correctAnswers,
    });
    await newQuestion.save();

    // Update totalQuestions count in the chapter
    await Chapter.findOneAndUpdate(
      { chapterId },
      { $inc: { totalQuestions: 1 } }
    );

    res.status(201).json({
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error("❌ Error creating question:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Update a question by questionId
 * @route   PUT /questions/:questionId
 */
exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Define allowed fields based on the schema
    const allowedFields = [
      "questionText",
      "questionType",
      "options",
      "correctAnswers",
    ];

    const updates = {};

    // Filter request body to update only allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const updatedQuestion = await Question.findOneAndUpdate(
      { questionId },
      { $set: updates },
      { new: true, runValidators: true } // Ensure validation is applied
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error(`❌ Error updating question ${questionId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Delete a question by questionId
 * @route   DELETE /questions/:questionId
 */
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Find the question
    const question = await Question.findOne({ questionId }).lean();
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Delete the question
    const deleteResult = await Question.deleteOne({ questionId });
    if (deleteResult.deletedCount > 0) {
      // Update totalQuestions count in the chapter only if deletion was successful
      await Chapter.findOneAndUpdate(
        { chapterId: question.chapterId },
        { $inc: { totalQuestions: -1 } }
      );
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(`❌ Error deleting question ${questionId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
