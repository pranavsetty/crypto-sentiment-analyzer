import React, { useState } from "react";
import axios from "axios";

export const analyzeSentiment = async (text) => {
  try {
    // Check if text is [Removed] or empty
    if (!text || text === "[Removed]") {
      console.log("Skipping removed or empty text");
      return 0; // Return neutral sentiment for removed content
    }

    const response = await axios.post("http://localhost:5001/api/sentiment", {
      text: text, // Make sure text is being passed correctly
    });

    console.log("Response:", response.data); // Log the response
    return response.data.sentiment;
  } catch (error) {
    console.error("Full error:", error); // Log the full error
    throw error;
  }
};

const SentimentAnalysis = ({ text }) => {
  const [sentiment, setSentiment] = useState("");

  const analyzeSentiment = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/sentiment", {
        text,
      });
      setSentiment(response.data);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    }
  };

  return (
    <div>
      <button onClick={analyzeSentiment}>Analyze Sentiment</button>
      {sentiment && <p>Sentiment: {sentiment}</p>}
    </div>
  );
};

export default SentimentAnalysis;
