// export default async function llmCall(prompt, stopWords) {
//   // const url = "http://api.ausboss.io/v1/completions";
//   const url = "http://api.openai.com/v1/completions";
//   const postData = {
//     prompt: prompt,
//     max_tokens: 1000,
//     temperature: 1.14,
//     top_p: 0.9,
//     min_p: 0.06,
//     repetition_penalty: 1.3,
//     stop: stopWords,
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(postData),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     const dataText = data.choices[0].text;
//     console.log(dataText);
//     return dataText;
//   } catch (error) {
//     console.error("Request failed:", error);
//   }
// }
import { OpenAI } from "@langchain/openai";
import config from "../config.js";

export default async function llmCall(prompt, stopWords) {
  console.log("stopWords", stopWords);
  const openai = new OpenAI({
    openAIApiKey: config.llmApiKey, // provide a default value if the key is not set
    configuration: {
      baseURL: config.llmBaseUrl,
      // You can add more default configuration options here
      // For example, you can set `maxTokens` and other parameters if they are static or passed via environment variables
    },
  });

  try {
    // If specific request parameters are needed, they can be passed directly in the invoke method
    const options = {
      prompt: prompt,
      stop: stopWords,
      maxTokens: 200,
      temperature: 1,
      // Include other parameters as needed, potentially reading them from `config`
    };

    const response = await openai.invoke(options);
    // console.log(response);

    // console.log(response.text); // Adjust based on how the response is structured
    return response;
  } catch (error) {
    console.error("LLM request failed:", error);
    throw error; // Rethrowing the error or handling it as needed
  }
}
