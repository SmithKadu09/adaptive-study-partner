const { generate } = require("../services/llm/llmService");

const testLLM = async (req, res) => {
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful educational assistant.",
      },
      {
        role: "user",
        content:
          "Explain PCA in simple words for a beginner.",
      },
    ];

    const response = await generate(messages);

    res.status(200).json({
      message: "LLM response generated successfully",
      response,
    });
  } catch (error) {
    console.error("LLM error:", error);

    res.status(500).json({
      message: "LLM request failed",
      error: error.message,
    });
  }
};

module.exports = {
  testLLM,
};