import React, { useState, useEffect, useRef } from "react";
import { getAIResponse } from "../data/data.js";

export default function ChatView({ initialMessages, onBack }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = { role: "ai", text: getAIResponse(text), hasButton: true };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1600);
  };

  const handleSend = () => {
    const val = inputValue.trim();
    if (!val) return;
    setInputValue("");
    sendMessage(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-wrap">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <div className={`msg-avatar ${msg.role === "ai" ? "ai" : "user-av"}`}>
              {msg.role === "ai" ? "F" : "YW"}
            </div>
            <div className="msg-bubble">
              <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              {msg.hasButton && (
                <>
                  <br /><br />
                  <button
                    className="ai-output-btn"
                    onClick={() =>
                      alert(
                        "In a full build, this would generate and display the live code preview!"
                      )
                    }
                  >
                    ⚡ View Generated Output
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="msg ai">
            <div className="msg-avatar ai">F</div>
            <div className="msg-bubble">
              <div className="typing-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-bar">
        <div className="prompt-container">
          <textarea
            className="prompt-input"
            placeholder="Continue the conversation…"
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="prompt-toolbar">
            <div className="prompt-tools">
              <button className="tool-btn">📎 Attach</button>
              <button className="tool-btn" onClick={onBack}>
                ← Back
              </button>
            </div>
            <button className="send-btn" onClick={handleSend}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}