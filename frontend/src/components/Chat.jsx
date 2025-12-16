import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chat.css";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const bodyRef = useRef(null);

  // auto scroll
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const time = new Date().toLocaleTimeString();

    // user message
    setMessages((prev) => [
      ...prev,
      { user: "You", text, time },
    ]);

    setInput("");
    setSending(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chats", {
        text,
      });

      setMessages((prev) => [
        ...prev,
        {
          user: "Bot",
          text: res.data.reply || "No reply",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          user: "Bot",
          text: " Server error. Please try again.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat">
      <div className="chat-header">Genovation Chat</div>

      <div className="chat-body" ref={bodyRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.user === "You" ? "sent" : "received"}`}
          >
            <div className="bubble">
              <div className="meta">
                <span className="user">{m.user}</span>
                <span className="time">{m.time}</span>
              </div>
              <div className="text">{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <textarea
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
        />
        <button onClick={sendMessage} disabled={sending || !input.trim()}>
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
