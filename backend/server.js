const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.get("/api/news", async (req, res) => {
  try {
    const response = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: "cryptocurrency",
        apiKey: process.env.NEWS_API_KEY,
      },
    });
    res.json(response.data.articles);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.post("/api/sentiment", async (req, res) => {
  try {
    const { text } = req.body;

    // Check if text is provided
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found");
      return res.status(500).json({ error: "API key not configured" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a sentiment analyzer. Respond with only a number between -1 and 1.",
          },
          {
            role: "user",
            content: `Analyze the sentiment of this text: ${text}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const sentiment = parseFloat(response.data.choices[0].message.content);
    res.json({ sentiment });
  } catch (error) {
    // Detailed error logging
    console.error(
      "Sentiment analysis error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to analyze sentiment",
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
