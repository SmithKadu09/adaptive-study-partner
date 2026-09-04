const express = require("express");

const {
  generateAssessment,
  submitAssessment,
} = require("../controllers/assessmentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/generate", protect, generateAssessment);
router.post("/", protect, submitAssessment);

module.exports = router;