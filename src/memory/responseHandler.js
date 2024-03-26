import { promptFormatter } from "./promptFormatter.js";
import { historyFormatter } from "../memory/historyFormatter.js";
import llmCall from "../chatlogic/llmCall.js";

// Revised processMessage function
export async function processMessage(message, memories, client) {
  // console.log(message);

  const chatMessages = await historyFormatter(
    message.channelId,
    client.user.username,
    10
  );

  // Determine the userName of the message sender
  const userName = message.author.globalName;
  const botName = client.user.username;

  // console.log("userName:", userName);
  const prompt = await promptFormatter(
    botName,
    userName,
    message.cleanContent,
    chatMessages
  );

  try {
    if (message.guildId) return;

    const chainResponse = await llmCall(prompt);

    // Check for a valid response
    if (chainResponse) {
      return chainResponse;
    } else {
      // Handle cases where no response is received
      console.log("No response received from chain.call");
      return "Error. Check the logs.";
    }
  } catch (error) {
    console.error("An error occurred in processMessage:", error);
  }
}
