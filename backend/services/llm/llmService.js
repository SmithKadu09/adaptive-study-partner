const llmConfig = require("../../config/llmConfig");

const openrouter = require("./openrouter");

const generate = async (messages) => {
  switch (llmConfig.provider) {
    case "openrouter":
      return await openrouter.generateResponse(messages);

    default:
      throw new Error(
        `Unsupported LLM provider: ${llmConfig.provider}`
      );
  }
};

module.exports = {
  generate,
};