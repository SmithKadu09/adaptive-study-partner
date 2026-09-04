const express = require("express");

const {
  getMySessions,
  getSessionById,
} = require("../controllers/sessionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMySessions);

router.get("/:id", protect, getSessionById);

module.exports = router;