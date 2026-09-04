const express = require("express");

const { teacherChat } = require("../controllers/teacherController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/chat", protect, teacherChat);

module.exports = router;