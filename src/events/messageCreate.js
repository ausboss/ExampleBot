import { processMessage } from "../memory/responseHandler.js";
import { logDetailedMessage } from "../memory/chatLog.js";
import { BufferMemory } from "langchain/memory";

export default {
  name: "messageCreate",
  async execute(message, memories, client, sharedState, channels) {
    console.log(memories);

    if (!message.guildId) {
      if (!Object.hasOwn(memories.DM, message.channelId)) {
        memories.DM[message.channelId] = new BufferMemory();
      }
    } else {
      if (
        !Object.hasOwn(memories.CHANNEL, message.channelId) &&
        channels.includes(message.channelId)
      ) {
        memories.CHANNEL[message.channelId] = new BufferMemory();
      }
    }
    console.log(memories);
    console.log(message.channelId);
    //   if (!channels.includes(message.channel.id)) return;
    //   if (message.mentions.users.has(client.user.id)) {
    //     const messageContent = await processMessage(message, client);
    //     const sentMessage = await message.reply(messageContent);
    //     await logDetailedMessage(message);
    //     await logDetailedMessage(sentMessage); // Ensure logDetailedMessage is imported or accessible
    //     // console.log(`Bot's response: ${sentMessage.content}`);
    //   }
  },
};
