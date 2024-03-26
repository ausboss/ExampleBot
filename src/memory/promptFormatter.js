import { readFileSync } from "fs";

const string_output = readFileSync("prompt.txt", "utf8");

export async function promptFormatter(char, user, userMessage, history) {
  // replace char and user from string_output with the actual values
  const formattedPrompt = string_output
    .replace("{{char}}", char)
    .replace("{{user}}", user)
    .replace("{{history}}", history);

  return `${formattedPrompt}\n${user}: ${userMessage}\n${char}: `;
}
