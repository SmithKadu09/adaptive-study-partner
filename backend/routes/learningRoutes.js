const express = require("express");

const {
  getLearningRecommendations,
} = require("../controllers/learningController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/recommendations", protect, getLearningRecommendations);

module.exports = router;