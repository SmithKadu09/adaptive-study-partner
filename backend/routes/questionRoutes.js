const express = require("express");

const {
  createQuestion,
  getQuestions,
} = require("../controllers/questionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createQuestion);

router.get("/", protect, getQuestions);

module.exports = router;