const express = require("express");

const {
  getMyPerformance,
} = require("../controllers/performanceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyPerformance);

module.exports = router;