const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  reply: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
