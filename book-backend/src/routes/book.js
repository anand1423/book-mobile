const express = require("express");
const router = express.Router();

const bookController = require("../controllers/booksController");
router.get("/all", bookController.getBooks);
router.post("/", bookController.createBook);
router.get("/:bookId", bookController.getBookById);
router.put("/:bookId", bookController.updateBook);
router.delete("/:bookId", bookController.deleteBook);

module.exports = router;
