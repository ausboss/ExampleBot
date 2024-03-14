console.log("messageCreate event listener loaded");
import { insertChatLog, logDetailedMessage } from "../db/chatLog.js";

export default {
  name: "messageCreate",
  execute(message, client, sharedState, channels) {
    if (!channels.includes(message.channel.id)) return;

    console.log(message);
    console.log(`${message.member.displayName}: ${message.content}`);
    insertChatLog(
      message.member.displayName,
      message.content,
      message.createdTimestamp
    );
    logDetailedMessage(message);
    // Further logic here
  },
};
