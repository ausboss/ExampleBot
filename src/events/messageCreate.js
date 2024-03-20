import { processMessage } from "../memory/responseHandler.js";
import { logDetailedMessage } from "../memory/chatLog.js";

// Helper function to split messages
const splitMessages = (content, maxLength) => {
  const parts = [];
  while (content.length) {
    let length = content.length > maxLength ? maxLength : content.length;
    let part = content.substring(0, length);
    let lastNewline = part.lastIndexOf("\n");

    // Try to split at the last newline character if it's too long
    if (part.length === maxLength && lastNewline > -1) {
      part = part.substring(0, lastNewline);
    }

    parts.push(part);
    content = content.substring(part.length);
  }
  return parts;
};

export default {
  name: "messageCreate",
  async execute(message, memories, client, sharedState, channels) {
    if (message.author.bot) return;

    console.log("Bot was mentioned");
    // Assuming processMessage returns a string that could be longer than 2000 characters
    const messageContent = await processMessage(message, memories, client);

    // Discord's character limit per message
    const CHAR_LIMIT = 2000;

    if (messageContent.length <= CHAR_LIMIT) {
      // If message content is within the limit, send it as is
      const sentMessage = await message.reply(messageContent);
      await logDetailedMessage(message, client);
      await logDetailedMessage(sentMessage, client);
    } else {
      // If message content exceeds the limit, split and send separately
      const messagesParts = splitMessages(messageContent, CHAR_LIMIT);
      for (const part of messagesParts) {
        const sentMessage = await message.reply(part);
        await logDetailedMessage(message, client);
        await logDetailedMessage(sentMessage, client);
        // Consider adding a short delay here if you're sending many messages to avoid rate limits
      }
    }

    console.log(memories.DM[message.channelId].chatHistory.messages);
  },
};
