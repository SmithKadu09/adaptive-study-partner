const express = require("express");
const {
  getLearningProgress,
} = require("../controllers/learningProgressController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getLearningProgress);

module.exports = router;