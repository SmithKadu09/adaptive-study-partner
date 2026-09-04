const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

const generateResponse = async (prompt) => {
  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is missing or invalid");
    }

    const response = await client.chat.completions.create({
      model: process.env.LLM_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenRouter error:", error);

    throw new Error(
      error?.error?.message ||
        error?.message ||
        "OpenRouter request failed"
    );
  }
};

module.exports = {
  generateResponse,
};