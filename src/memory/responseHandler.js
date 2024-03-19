import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  openAIApiKey: "sk-",
  configuration: {
    baseURL: "https://ebony-baseball-possession-daniel.trycloudflare.com/v1",
  },
  maxTokens: 200,
  temperature: 1,
});

export async function processMessage(message, client) {
  const response = await model.invoke(
    `${message.member.displayName}: ${message.cleanContent}`
  );
  if (response && response.content) {
    console.log(`Response content before split: ${response.content}`);
    const splitResponse = response.content.split(`${client.user.username}: `);
    const messageContent =
      // If the bot's username is mentioned, use the second part of the split otherwise use the first part
      splitResponse.length > 1 ? splitResponse[1] : splitResponse[0];
    console.log(`${message.member.displayName}: ${message.cleanContent}`);
    console.log(`Bot's response: ${messageContent}`);

    return messageContent; // Return the message content to be sent
  } else {
    console.log("No response received from model.invoke");
    return "Error. Check the logs.";
  }
}
