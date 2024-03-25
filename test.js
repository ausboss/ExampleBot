// const url = "http://api.ausboss.io/v1/chat/completions";

// let history = [];
// history.push({
//   role: "system",
//   content:
//     "### Instruction: The following is a conversation between a user and member from the Ku Klux Klan. Do not mention artificial intelligence or any other AI-related topics.",
// });

// let userMessage = "Telle me about yourself";
// history.push({ role: "user", content: userMessage });

// async function getChatbotResponse(url = "", history = []) {
//   const response = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       mode: "instruct",
//       messages: history,
//     }),
//   });
//   const responseData = await response.json();
//   return responseData;
// }

// getChatbotResponse(url, history)
//   .then((data) => {
//     if (data.choices && data.choices.length > 0) {
//       const assistantMessage = data.choices[0].message.content;
//       console.log(assistantMessage);

//       history.push({ role: "Obama", content: assistantMessage });
//     } else {
//       console.log("Received unexpected data format:", data);
//     }
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

// fetch("http://api.ausboss.io/v1/completions", {
//   method: "POST", // or 'PUT'
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     key: "value",
//     id: 123,
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => console.log("Success:", data))
//   .catch((error) => console.error("Error:", error));

// import { readFileSync } from "fs";

// const string_output = readFileSync("prompt.txt", "utf8");

import { open } from "sqlite";
import sqlite3 from "sqlite3";

async function openDb(filename) {
  // Open a database connection
  return open({
    filename,
    driver: sqlite3.Database,
  });
}

function removeBotName(name, message) {
  // Remove the 'Bot_name: ' prefix from the message
  const botName = [name];
  const botNameRegex = new RegExp(`^(${botName.join("|")}): `);
  return message.replace(botNameRegex, "");
}

async function getLastXMessages(db, channel_id, x) {
  // Retrieve the last X messages for a specified channel
  const query = `
        SELECT name, clean_content FROM (
            SELECT COALESCE(global_name, user_name) AS name, clean_content, created_timestamp
            FROM dms
            WHERE channel_id = ?
            ORDER BY created_timestamp DESC
            LIMIT ?
        ) sub ORDER BY created_timestamp ASC
    `;

  const messages = await db.all(query, channel_id, x);
  return messages;
}

// Example usage
async function main() {
  const dbPath = "messages.db"; // Replace with your database path
  const db = await openDb(dbPath);
  const channel_id = "1048378429231337493"; // Replace with your actual channel ID
  const x = 10; // Number of messages you want to retrieve

  try {
    const messages = await getLastXMessages(db, channel_id, x);
    // Format the messages into a single string
    const formattedMessages = messages
      .map(
        (message) =>
          `${message.name}: ${removeBotName("Tensor", message.clean_content)}`
      )
      .join("\n");
    console.log(formattedMessages);
  } finally {
    await db.close();
  }
}

main().catch(console.error);
