const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require("path");


const app = express();
app.use(cors());
app.use(bodyParser.json());
const fetch = require("node-fetch");


//  Test function
//  Test function using fetch
async function chatWithGPT(message) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    console.log("OpenRouter response:", data);

    if (!data.choices || !data.choices[0]) {
      console.error("❌ Invalid or missing response from OpenRouter:", data);
      return;
    }

    console.log("✅ GPT:", data.choices[0].message.content);
  } catch (error) {
    console.error("OpenRouter Error:", error.message);
  }
}


// Test it once on server start
chatWithGPT("Hello Abilash! What can you do?");

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: messages,
      }),
    });

    const data = await response.json();
    console.log("OpenRouter API Response:", data);

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        reply: "⚠️ OpenRouter API returned an unexpected response. Please try again.",
        raw: data,
      });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("OpenRouter Error:", err.message);
    res.status(500).json({ reply: "❌ Failed to connect to OpenRouter." });
  }
});




const buildPath = path.join(__dirname, "../Client/build"); 

console.log("Serving React app from:", buildPath);

app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(` Server running at http://localhost:${PORT}`)
);


