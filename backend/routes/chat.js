const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // Gemini call (NEW SDK)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    const reply = response.text || "No reply from Gemini";

    // save to DB
    const savedMessage = await Message.create({
      user: "You",
      message: text,
      reply,
    });

    res.json(savedMessage);
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
