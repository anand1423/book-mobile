const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    bookId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String }, // Optional description of the book
    imageUrl: { type: String }, // Cover image (if needed)
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
