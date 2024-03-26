export default async function llmCall(prompt, stopWords) {
  const url = "http://api.ausboss.io/v1/completions";
  const postData = {
    prompt: prompt,
    max_tokens: 1000,
    temperature: 1.14,
    top_p: 0.9,
    min_p: 0.06,
    stop: ["Tensor: ", "Peepy: "],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const dataText = data.choices[0].text;
    console.log(dataText);
    return dataText;
  } catch (error) {
    console.error("Request failed:", error);
  }
}
