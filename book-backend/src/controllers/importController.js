const xlsx = require("xlsx");
const path = require("path");
const Book = require("../models/book");
const Part = require("../models/part");
const Chapter = require("../models/chapter");
const Question = require("../models/question");

exports.importData = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../Structured_Book_Data.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheets = workbook.SheetNames;

    let books = [];
    let parts = [];
    let chapters = [];
    let questions = [];

    sheets.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      jsonData.forEach((row) => {
        if (sheetName.toLowerCase().includes("book")) {
          if (row["BookID"] && row["Title"]) {
            books.push({
              bookId: row["BookID"],
              title: row["Title"],
              description: row["Description"] || "",
              imageUrl: row["ImageURL"] || "",
            });
          }
        }

        if (sheetName.toLowerCase().includes("part")) {
          if (row["PartID"] && row["BookID"] && row["Title"]) {
            parts.push({
              partId: row["PartID"],
              bookId: row["BookID"],
              title: row["Title"],
            });
          }
        }

        if (sheetName.toLowerCase().includes("chapter")) {
          if (
            row["ChapterID"] &&
            row["BookID"] &&
            row["PartID"] &&
            row["Title"] &&
            row["Text"]
          ) {
            chapters.push({
              chapterId: row["ChapterID"],
              bookId: row["BookID"],
              partId: row["PartID"],
              title: row["Title"],
              text: row["Text"],
              totalQuestions: row["TotalQuestions"]
                ? Number(row["TotalQuestions"])
                : 0,
              questionsPerSession: row["QuestionsPerSession"]
                ? Number(row["QuestionsPerSession"])
                : 0,
              order: row["Order"] ? Number(row["Order"]) : 0,
              passingPercentage: row["PassingPercentage"]
                ? Number(row["PassingPercentage"])
                : 80,
            });
          }
        }

        if (sheetName.toLowerCase().includes("question")) {
          if (
            row["QuestionID"] &&
            row["ChapterID"] &&
            row["QuestionText"] &&
            row["Type"]
          ) {
            questions.push({
              questionId: row["QuestionID"],
              chapterId: row["ChapterID"],
              questionText: row["QuestionText"],
              questionType: row["Type"],
              options: row["Options"],
              correctAnswers: row["CorrectAnswers"],
            });
          }
        }
      });
    });

    // Use Upsert Logic (Update if exists, Insert if not)
    const upsertOptions = { upsert: true, new: true };

    // Process Books
    for (const book of books) {
      await Book.findOneAndUpdate({ bookId: book.bookId }, book, upsertOptions);
    }

    // Process Parts
    for (const part of parts) {
      await Part.findOneAndUpdate({ partId: part.partId }, part, upsertOptions);
    }

    // Process Chapters
    for (const chapter of chapters) {
      await Chapter.findOneAndUpdate(
        { chapterId: chapter.chapterId },
        chapter,
        upsertOptions
      );
    }

    // Process Questions
    for (const question of questions) {
      await Question.findOneAndUpdate(
        { questionId: question.questionId },
        question,
        upsertOptions
      );
    }

    console.log("✅ Data imported successfully");
    res.status(200).json({ message: "Data imported successfully." });
  } catch (error) {
    console.error("❌ Error importing data:", error);
    res.status(500).json({ message: "Error importing data", error });
  }
};
