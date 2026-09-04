const llmConfig = {
  provider: process.env.LLM_PROVIDER || "openrouter",

  model: process.env.LLM_MODEL || "openrouter/free",

  apiKey: process.env.LLM_API_KEY,

  baseURL:
    process.env.LLM_BASE_URL ||
    "https://openrouter.ai/api/v1",
};

module.exports = llmConfig;