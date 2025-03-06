const express = require("express");
const router = express.Router();

const userProgressController = require("../controllers/userProgressController");
router.post("/", userProgressController.createUserProgress);
router.get("/:userId", userProgressController.getUserProgress);
router.put("/:userId", userProgressController.updateUserProgress);
router.delete("/:userId", userProgressController.deleteUserProgress);
router.patch(
  "/:userId/book/:bookId/chapter/:chapterId",
  userProgressController.markChapterCompleted
);
router.patch(
  "/:userId/book/:bookId/quiz/:quizId",
  userProgressController.updateQuizResult
);

module.exports = router;
