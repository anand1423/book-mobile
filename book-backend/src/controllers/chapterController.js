const Chapter = require("../models/chapter");
const Question = require("../models/question");

// ✅ Create a new chapter (handling all schema fields)
exports.createChapter = async (req, res) => {
  try {
    const {
      chapterId,
      bookId,
      partId,
      title,
      text,
      totalQuestions,
      questionsPerSession,
      order,
      passingPercentage,
    } = req.body;

    // Check if the chapter already exists
    const existingChapter = await Chapter.findOne({ chapterId });
    if (existingChapter) {
      return res
        .status(400)
        .json({ message: "Chapter with this ID already exists" });
    }

    // Create a new chapter
    const newChapter = new Chapter({
      chapterId,
      bookId,
      partId,
      title,
      text,
      totalQuestions: totalQuestions || 0,
      questionsPerSession: questionsPerSession || 0,
      order,
      passingPercentage: passingPercentage || 80, // Default is 80% if not provided
    });

    // Save to DB
    await newChapter.save();
    res
      .status(201)
      .json({ message: "Chapter created successfully", chapter: newChapter });
  } catch (error) {
    console.error("❌ Error creating chapter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get all chapters (with respective questions)
exports.getAllChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find().lean();

    const chaptersWithQuestions = await Promise.all(
      chapters.map(async (chapter) => {
        const questions = await Question.find({
          chapterId: chapter.chapterId,
        }).lean();
        return { ...chapter, questions };
      })
    );

    res.status(200).json(chaptersWithQuestions);
  } catch (error) {
    console.error("❌ Error fetching chapters:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Get a chapter by ID (with respective questions)
exports.getChapterById = async (req, res) => {
  try {
    const { chapterId } = req.params;

    const chapter = await Chapter.findOne({ chapterId }).lean();
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const questions = await Question.find({ chapterId }).lean();
    res.status(200).json({ ...chapter, questions });
  } catch (error) {
    console.error("❌ Error fetching chapter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update a chapter (ensures all fields can be updated)
exports.updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    // Define allowed fields based on the schema
    const allowedFields = [
      "title",
      "text", // Correct field instead of "content"
      "totalQuestions",
      "questionsPerSession",
      "order",
      "passingPercentage",
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

    const updatedChapter = await Chapter.findOneAndUpdate(
      { chapterId },
      { $set: updates },
      { new: true, runValidators: true } // Ensure validation is applied
    );

    if (!updatedChapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.status(200).json({
      message: "Chapter updated successfully",
      chapter: updatedChapter,
    });
  } catch (error) {
    console.error(`❌ Error updating chapter ${req.params.chapterId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Delete a chapter (removes respective questions)
exports.deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    // Check if chapter exists
    const chapter = await Chapter.findOne({ chapterId });
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // Delete all questions linked to this chapter
    await Question.deleteMany({ chapterId });

    // Delete the chapter
    await Chapter.findOneAndDelete({ chapterId });

    res.status(200).json({
      message: "Chapter and associated questions deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting chapter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
