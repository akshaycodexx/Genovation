import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chat.css";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [username, setUsername] = useState("User");
  const bodyRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentUserName = "User";
        try {
          const profileRes = await axios.get("http://localhost:5000/api/auth/profile", {
            withCredentials: true
          });
          if (profileRes.data && profileRes.data.username) {
            currentUserName = profileRes.data.username;
            setUsername(currentUserName);
          }
        } catch (profileError) {
          console.error("Profile fetch error", profileError);
          if (profileError.response && profileError.response.status === 401) {
            navigate("/login");
            return;
          }
        }

        const chatRes = await axios.get("http://localhost:5000/api/chats", {
          withCredentials: true,
        });
        const msgs = chatRes.data.map(m => ([
          { user: currentUserName, text: m.message, time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          { user: "Bot", text: m.reply, time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ])).flat();
        setMessages(msgs);

        const prompts = chatRes.data.map(m => m.message);
        setHistoryList(prompts.reverse());

      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { user: username || "You", text, time },
    ]);
    setInput("");
    setSending(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chats", {
        text,
      }, {
        withCredentials: true
      });

      setMessages((prev) => [
        ...prev,
        {
          user: "Bot",
          text: res.data.reply || "No reply",
          time: new Date().toLocaleTimeString(),
        },
      ]);

      setHistoryList(prev => [text, ...prev]);

    } catch (error) {
      console.error("Msg error", error);
      setMessages((prev) => [
        ...prev,
        {
          user: "Bot",
          text: "Error sending message. Please try again.",
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

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>History</h3>
        </div>
        <div className="history-list">
          {historyList.map((h, i) => (
            <div key={i} className="history-item">
              {h.length > 30 ? h.substring(0, 30) + "..." : h}
            </div>
          ))}
          {historyList.length === 0 && <div className="no-history">No history yet</div>}
        </div>
        <div className="sidebar-footer">
          <div className="profile-section">
            <div className="avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="username">{username}</div>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-header">Genovation Chat</div>

        <div className="chat-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`message ${m.user === "You" || m.user === username ? "sent" : "received"}`}
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

        <div className="chat-input-area">
          <textarea
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
          />
          <button onClick={sendMessage} disabled={sending || !input.trim()}>
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
