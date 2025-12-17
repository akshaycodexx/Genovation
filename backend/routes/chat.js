const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AuthMiddleware = require("../middlewares/Auth");


const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("CRITICAL ERROR: GEMINI_API_KEY is missing from .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);


router.get("/", AuthMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      user: req.user._id,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/", AuthMiddleware, async (req, res) => {
  try {
    const { text } = req.body;


    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User authentication failed" });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }


    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    let reply = "";

    try {

      const result = await model.generateContent(text);
      const response = await result.response;


      reply = response.text();

      if (!reply) {
        reply = "AI generated an empty response (possibly blocked by safety filters).";
      }
    } catch (err) {

      console.error("--- Gemini API Error Details ---");
      console.error("Message:", err.message);

      if (err.message.includes("429")) {
        reply = "AI Error: Rate limit exceeded (too many requests).";
      } else if (err.message.includes("403")) {
        reply = "AI Error: Access denied (check API key or region).";
      } else if (err.message.includes("API key not valid")) {
        reply = "AI Error: Your API key is invalid.";
      } else {
        reply = `AI Error: ${err.message}`;
      }
    }


    const savedMessage = await Message.create({
      user: req.user._id,
      message: text,
      reply: reply,
    });

    res.json(savedMessage);
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
