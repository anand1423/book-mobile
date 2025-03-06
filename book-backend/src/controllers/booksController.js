const Book = require("../models/book");
const Part = require("../models/part");
const Chapter = require("../models/chapter");
const Question = require("../models/question");

/**
 * @desc    Get all books with parts, chapters, and questions
 * @route   GET /books/all
 */
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().lean();

    const booksWithDetails = await Promise.all(
      books.map(async (book) => {
        try {
          // Fetch parts related to the book
          const parts = await Part.find({ bookId: book.bookId }).lean();

          // Fetch chapters for each part
          const partsWithChapters = await Promise.all(
            parts.map(async (part) => {
              try {
                const chapters = await Chapter.find({
                  partId: part.partId,
                }).lean();

                // Fetch questions for each chapter
                const chaptersWithQuestions = await Promise.all(
                  chapters.map(async (chapter) => {
                    try {
                      const questions = await Question.find({
                        chapterId: chapter.chapterId,
                      }).lean();
                      return {
                        ...chapter,
                        questions: questions.length ? questions : [],
                      };
                    } catch (error) {
                      console.error(
                        `❌ Error fetching questions for chapter ${chapter.chapterId}:`,
                        error
                      );
                      return { ...chapter, questions: [] };
                    }
                  })
                );

                return {
                  ...part,
                  chapters: chaptersWithQuestions.length
                    ? chaptersWithQuestions
                    : [],
                };
              } catch (error) {
                console.error(
                  `❌ Error fetching chapters for part ${part.partId}:`,
                  error
                );
                return { ...part, chapters: [] };
              }
            })
          );

          return {
            ...book,
            parts: partsWithChapters.length ? partsWithChapters : [], // Ensure parts array exists
          };
        } catch (error) {
          console.error(
            `❌ Error fetching parts for book ${book.bookId}:`,
            error
          );
          return { ...book, parts: [] }; // Safe fallback if fetching parts fails
        }
      })
    );

    res.status(200).json(booksWithDetails);
  } catch (error) {
    console.error("❌ Error fetching books:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Create a new book
 * @route   POST /books
 */
exports.createBook = async (req, res) => {
  try {
    const { bookId, title, description, imageUrl } = req.body;

    const existingBook = await Book.findOne({ bookId });
    if (existingBook) {
      return res.status(400).json({ message: "Book already exists" });
    }

    const newBook = new Book({ bookId, title, description, imageUrl });
    await newBook.save();

    res
      .status(201)
      .json({ message: "Book created successfully", book: newBook });
  } catch (error) {
    console.error("❌ Error creating book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Get a single book by bookId
 * @route   GET /books/:bookId
 */
exports.getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ bookId }).lean();
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const parts = await Part.find({ bookId }).lean();

    const partsWithChapters = await Promise.all(
      parts.map(async (part) => {
        const chapters = await Chapter.find({ partId: part.partId }).lean();
        const chaptersWithQuestions = await Promise.all(
          chapters.map(async (chapter) => {
            const questions = await Question.find({
              chapterId: chapter.chapterId,
            }).lean();
            return { ...chapter, questions };
          })
        );
        return { ...part, chapters: chaptersWithQuestions };
      })
    );

    res.status(200).json({ ...book, parts: partsWithChapters });
  } catch (error) {
    console.error(`❌ Error fetching book ${req.params.bookId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Update a book by bookId
 * @route   PUT /books/:bookId
 */
exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const allowedFields = ["title", "description", "imageUrl"]; // Only allowed fields
    const updateData = {};

    // Filter request body to update only allowed fields
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const updatedBook = await Book.findOneAndUpdate({ bookId }, updateData, {
      new: true, // Return updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error(`❌ Error updating book ${req.params.bookId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Delete a book by bookId (including related parts, chapters, and questions)
 * @route   DELETE /books/:bookId
 */
exports.deleteBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Check if book exists
    const book = await Book.findOne({ bookId });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Delete related parts, chapters, and questions
    await Part.deleteMany({ bookId });
    await Chapter.deleteMany({ bookId });
    await Question.deleteMany({ bookId });

    // Delete book
    await Book.deleteOne({ bookId });

    res
      .status(200)
      .json({ message: "Book and related data deleted successfully" });
  } catch (error) {
    console.error(`❌ Error deleting book ${req.params.bookId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
