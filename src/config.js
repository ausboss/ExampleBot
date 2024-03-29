import dotenv from "dotenv";
dotenv.config();

// Centralized configuration object
const config = {
  botToken: process.env.BOT_TOKEN,
  channelIds: process.env.CHANNEL_IDS ? process.env.CHANNEL_IDS.split(",") : [],
  llmApiKey: process.env.OPENAI_API_KEY || "sk-JZ9ItAWVJYcXYff",
  llmBaseUrl: process.env.LLM_BASE_URL || "https://api.openai.com/v1", // Default to OpenAI if not specified
  temperature: process.env.TEMPERATURE || 1, // Default temperature value
};

export default config;
