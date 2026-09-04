const express = require("express");

const { testLLM } = require("../controllers/llmController");

const router = express.Router();

router.get("/test", testLLM);

module.exports = router;