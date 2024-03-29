import { processMessage } from "../memory/responseHandler.js";
import { logDetailedMessage } from "../memory/chatLog.js";
import removeBotName from "../chatlogic/removeBotName.js";
import e from "cors";

// Helper function to delay execution, to be reused.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Processes and sends message content, handling Discord's character limit.
async function sendMessageInParts(message, content, client) {
  const CHAR_LIMIT = 2000;
  if (content.length <= CHAR_LIMIT) {
    const sentMessage = await message.reply(
      removeBotName(client.user.username, content)
    );
    await logDetailedMessage(sentMessage, client);
  } else {
    const messageParts = splitMessages(content, CHAR_LIMIT);
    for (const part of messageParts) {
      const sentMessage = await message.reply(
        removeBotName(client.user.username, part)
      );
      await logDetailedMessage(sentMessage, client);
      await delay(1000); // Wait for 1 second between message parts to avoid rate limiting
    }
  }
}

// Refactored event handler for clarity and efficiency
export default {
  name: "messageCreate",
  async execute(message, memories, client) {
    if (
      message.channel.guildId ||
      message.author.bot ||
      message.cleanContent.startsWith("/") ||
      message.cleanContent.startsWith(".")
    ) {
      return; // Ignore messages from bots or commands
    }
    await logDetailedMessage(message, client); // Log the user's message
    console.log(`${message.author.globalName}: ${message.cleanContent}`);
    let messageContent;
    try {
      messageContent = await processMessage(message, memories, client);
      if (typeof messageContent !== "string" || messageContent.trim() === "") {
        console.log("No valid message content to send.");
        return;
      }
    } catch (error) {
      console.error("Error processing message:", error);
      return; // Exit if processing fails
    }

    await sendMessageInParts(message, messageContent, client); // Handle sending message considering the character limit
  },
};
