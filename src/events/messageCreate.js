import { processMessage } from "../memory/responseHandler.js";
import { logDetailedMessage } from "../memory/chatLog.js";
import removeBotName from "../chatlogic/removeBotName.js";

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

    console.log("Bot response chain started");
    let messageContent;
    try {
      messageContent = await processMessage(message, memories, client);
    } catch (error) {
      console.error("Error processing message:", error);
      return; // Exit if processing fails
    }
    console.log("Message content:", messageContent);

    // Check if messageContent is a string and not empty
    if (typeof messageContent !== "string" || messageContent.length === 0) {
      console.log("No valid message content to send.");
      return;
    } else {
      await logDetailedMessage(message, client); // Log the user's message once
      // Get the last 10 messages from the channel

      // set the charlimit to 2000 per Discords limitations
      const CHAR_LIMIT = 2000;
      if (messageContent.length <= CHAR_LIMIT) {
        const sentMessage = await message.reply(
          removeBotName(client.user.username, messageContent)
        );
        await logDetailedMessage(sentMessage, client); // Log the bot's reply
      } else {
        const messagesParts = splitMessages(messageContent, CHAR_LIMIT);
        for (const part of messagesParts) {
          const sentMessage = await message.reply(
            removeBotName(client.user.username, part)
          );
          await logDetailedMessage(sentMessage, client); // Log each part of the bot's reply
          function delay(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
          }

          // Inside the loop, after sending a message part:
          await delay(1000); // Waits for 1 second
        }
      }
    }
  },
};
