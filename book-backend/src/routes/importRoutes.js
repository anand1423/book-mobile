const express = require("express");
const router = express.Router();

const { importData } = require("../controllers//importController");
router.post("/import-data", importData);

module.exports = router;
