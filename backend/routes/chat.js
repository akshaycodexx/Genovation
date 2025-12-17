const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AuthMiddleware = require("../middlewares/Auth");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
      model: "gemini-pro", 
    });

    let reply = "No reply from AI";

    try {
      const result = await model.generateContent(text);
      reply = result.response.text();
    } catch (err) {
      console.error("Gemini API Error:", err.message);
      reply = "AI service is temporarily unavailable. Please try again later.";
    }

    const savedMessage = await Message.create({
      user: req.user._id,
      message: text,
      reply,
    });

    res.json(savedMessage);
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
