const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterController");

router.post("/", chapterController.createChapter);
router.get("/all", chapterController.getAllChapters);
router.get("/:chapterId", chapterController.getChapterById);
router.put("/:chapterId", chapterController.updateChapter);
router.delete("/:chapterId", chapterController.deleteChapter);

module.exports = router;
