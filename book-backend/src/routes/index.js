const express = require("express");

const router = express.Router();

router.use("/import", require("./importRoutes"));
router.use("/book", require("./book"));
router.use("/chapters", require("./chapterRoutes"));
router.use("/questions", require("./question"));
router.use("/user-progress", require("./userProgress"));

module.exports = router;
