import React, { useState, useEffect, useRef } from "react";
import { getAIResponse } from "../data/data.js";

const extractHtml = (text) => {
  if (!text) return null;
  const match = text.match(/```html([\s\S]*?)```/);
  return match ? match[1].trim() : null;
};

function AIThinkingBlock({ reasoning }) {
  const [collapsed, setCollapsed] = useState(true);

  if (!reasoning) return null;

  return (
    <div className="thinking-container">
      <div 
        className="thinking-header" 
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="thinking-icon">🧠</span>
        <span className="thinking-title">Thinking Process</span>
        <span className="thinking-toggle-icon">{collapsed ? "▼" : "▲"}</span>
      </div>
      {!collapsed && (
        <div className="thinking-content">
          {reasoning}
        </div>
      )}
    </div>
  );
}

export default function ChatView({ initialMessages, onBack, chatCredits = 500, onUseChatCredit, activeChatId, onAppendMessages, onGenerateAIResponse }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlTitleInput, setUrlTitleInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activePreviewHtml, setActivePreviewHtml] = useState(null);

  const messagesEndRef = useRef(null);
  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const respondedRef = useRef(false);

  useEffect(() => {
    setMessages(initialMessages || []);
    respondedRef.current = false;
  }, [initialMessages]);

  useEffect(() => {
    const fetchInitialResponse = async () => {
      if (messages && messages.length > 0 && !respondedRef.current) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role === "user" && messages.length <= 2) {
          respondedRef.current = true;
          setIsTyping(true);

          const chatHistoryForAPI = messages.map(m => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text
          }));

          const responseObj = await onGenerateAIResponse?.(chatHistoryForAPI) || { content: "", reasoning: "" };
          const responseText = typeof responseObj === "string" ? responseObj : (responseObj.content || "");
          const reasoningText = typeof responseObj === "string" ? "" : (responseObj.reasoning || "");
          setIsTyping(false);
          const aiMsg = { 
            role: "ai", 
            text: responseText, 
            reasoning: reasoningText,
            hasButton: responseText.includes("```html")
          };
          setMessages((prev) => {
            if (prev.length > 0 && prev[prev.length - 1].role === "ai") {
              return prev;
            }
            return [...prev, aiMsg];
          });
          onAppendMessages?.([aiMsg]);
        }
      }
    };
    fetchInitialResponse();
  }, [messages, onGenerateAIResponse, onAppendMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text, messageAttachments = []) => {
    if (!text.trim() && messageAttachments.length === 0) return;
    const userMsg = { role: "user", text, attachments: messageAttachments };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const chatHistoryForAPI = [
      ...messages.map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text
      })),
      { role: "user", content: text }
    ];

    const responseObj = await onGenerateAIResponse?.(chatHistoryForAPI) || { content: "", reasoning: "" };
    const responseText = typeof responseObj === "string" ? responseObj : (responseObj.content || "");
    const reasoningText = typeof responseObj === "string" ? "" : (responseObj.reasoning || "");
    setIsTyping(false);
    const aiMsg = { 
      role: "ai", 
      text: responseText, 
      reasoning: reasoningText,
      hasButton: responseText.includes("```html") 
    };
    setMessages((prev) => [...prev, aiMsg]);
    
    // Save messages to database
    onAppendMessages?.([
      userMsg,
      aiMsg
    ]);
  };

  const handleSend = async () => {
    const val = inputValue.trim();
    if (!val && attachments.length === 0) return;

    if (chatCredits < 1) {
      const systemMsg = {
        role: "ai",
        text: "<span style='color: #f06a6a; font-weight: 600;'>⚠️ Out of Chat Credits!</span><br/>You have consumed all your chat credits. Please refill them in your Profile page or upgrade your plan to continue.",
        hasButton: false
      };
      setMessages((prev) => [...prev, systemMsg]);
      return;
    }

    const success = await onUseChatCredit?.();
    if (!success) {
      alert("Failed to consume chat credit. Please check your connection.");
      return;
    }

    setInputValue("");
    sendMessage(val, attachments);
    setAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Attachment Actions
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: "photo",
      url: URL.createObjectURL(file),
      size: formatBytes(file.size),
    }));
    
    setAttachments((prev) => [...prev, ...newAttachments]);
    setShowDropdown(false);
    e.target.value = "";
  };

  const handleDocSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: "document",
      url: "#",
      size: formatBytes(file.size),
    }));
    
    setAttachments((prev) => [...prev, ...newAttachments]);
    setShowDropdown(false);
    e.target.value = "";
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let formattedUrl = urlInput.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    let host = "Web Link";
    try {
      host = new URL(formattedUrl).hostname || "Web Link";
    } catch (_) {
      // fallback
    }

    const newAttachment = {
      id: Math.random().toString(36).substr(2, 9),
      name: urlTitleInput.trim() || host,
      type: "url",
      url: formattedUrl,
      size: host,
    };

    setAttachments((prev) => [...prev, newAttachment]);
    setUrlInput("");
    setUrlTitleInput("");
    setShowUrlModal(false);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    const newAttachments = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: isImage ? "photo" : "document",
        url: isImage ? URL.createObjectURL(file) : "#",
        size: formatBytes(file.size),
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
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
              {msg.role === "ai" && <AIThinkingBlock reasoning={msg.reasoning} />}
              <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              {msg.hasButton && (
                <div className="ai-output-actions">
                  <button
                    className="ai-output-btn"
                    onClick={() => {
                      const htmlCode = extractHtml(msg.text);
                      if (htmlCode) {
                        setActivePreviewHtml(htmlCode);
                      } else {
                        alert("No HTML code block found in response.");
                      }
                    }}
                    style={{ marginTop: 0 }}
                  >
                    ⚡ View Generated Output
                  </button>
                  <button
                    className="ai-action-btn"
                    onClick={() => {
                      const htmlCode = extractHtml(msg.text);
                      if (htmlCode) {
                        navigator.clipboard.writeText(htmlCode);
                        alert("📋 Code copied to clipboard!");
                      } else {
                        alert("No HTML code block found in response.");
                      }
                    }}
                  >
                    📋 Copy HTML
                  </button>
                  <button
                    className="ai-action-btn"
                    onClick={() => {
                      const htmlCode = extractHtml(msg.text);
                      if (htmlCode) {
                        const blob = new Blob([htmlCode], { type: "text/html" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "omma-3d-scene.html";
                        a.click();
                        URL.revokeObjectURL(url);
                      } else {
                        alert("No HTML code block found in response.");
                      }
                    }}
                  >
                    💾 Download HTML
                  </button>
                </div>
              )}

              {/* Message Attachments Rendering */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="message-attachments">
                  {/* Group image attachments */}
                  {msg.attachments.some((a) => a.type === "photo") && (
                    <div className="attachment-photo-grid">
                      {msg.attachments
                        .filter((a) => a.type === "photo")
                        .map((photo) => (
                          <div
                            key={photo.id}
                            className="attachment-photo-item"
                            onClick={() => setLightboxImage(photo)}
                          >
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="attachment-photo-img"
                            />
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Group document and URL attachments */}
                  {msg.attachments.some((a) => a.type !== "photo") && (
                    <div className="attachment-doc-list">
                      {msg.attachments
                        .filter((a) => a.type !== "photo")
                        .map((item) => (
                          <a
                            key={item.id}
                            href={item.url === "#" ? undefined : item.url}
                            target={item.url === "#" ? undefined : "_blank"}
                            rel="noreferrer"
                            className="attachment-doc-item"
                            onClick={(e) => {
                              if (item.url === "#") {
                                e.preventDefault();
                                alert(
                                  `In a production app, this would download or view the document: ${item.name}`
                                );
                              }
                            }}
                          >
                            <span className="attachment-doc-icon">
                              {item.type === "document" ? "📄" : "🔗"}
                            </span>
                            <span className="attachment-doc-name" title={item.name}>
                              {item.name}
                            </span>
                            <span className="attachment-doc-size">
                              {item.type === "document" ? item.size : "Open Link"}
                            </span>
                          </a>
                        ))}
                    </div>
                  )}
                </div>
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

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoSelect}
        accept="image/*"
        multiple
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={docInputRef}
        onChange={handleDocSelect}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.json,.zip"
        multiple
        style={{ display: "none" }}
      />

      <div className="chat-input-bar">
        <div className="prompt-container-relative">
          {/* Drag overlay */}
          {isDragging && (
            <div className="drag-overlay">
              <span>📥 Drop files here to attach</span>
            </div>
          )}

          <div
            className="prompt-container"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Render attachments preview row */}
            {attachments.length > 0 && (
              <div className="attachment-row">
                {attachments.map((item) => (
                  <div key={item.id} className="attachment-card">
                    {item.type === "photo" ? (
                      <img src={item.url} alt={item.name} className="attachment-thumb" />
                    ) : (
                      <div className="attachment-thumb">
                        {item.type === "document" ? "📄" : "🔗"}
                      </div>
                    )}
                    <div className="attachment-details">
                      <div className="attachment-name" title={item.name}>
                        {item.name}
                      </div>
                      <div className="attachment-meta">{item.size}</div>
                    </div>
                    <button
                      type="button"
                      className="attachment-delete"
                      onClick={() => removeAttachment(item.id)}
                      title="Remove attachment"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

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
                <div className="attach-wrapper">
                  <button
                    type="button"
                    className="tool-btn"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    📎 Attach
                  </button>

                  {/* Dropdown Backdrop */}
                  {showDropdown && (
                    <div
                      className="dropdown-backdrop"
                      onClick={() => setShowDropdown(false)}
                      style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 90,
                        cursor: "default",
                      }}
                    />
                  )}

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="attach-dropdown">
                      <div
                        className="attach-dropdown-item"
                        onClick={() => {
                          photoInputRef.current.click();
                          setShowDropdown(false);
                        }}
                      >
                        <span className="attach-dropdown-icon">📷</span>
                        <div className="attach-dropdown-info">
                          <span className="attach-dropdown-label">Upload Photo</span>
                          <span className="attach-dropdown-desc">PNG, JPG, GIF up to 10MB</span>
                        </div>
                      </div>
                      <div
                        className="attach-dropdown-item"
                        onClick={() => {
                          docInputRef.current.click();
                          setShowDropdown(false);
                        }}
                      >
                        <span className="attach-dropdown-icon">📄</span>
                        <div className="attach-dropdown-info">
                          <span className="attach-dropdown-label">Upload Document</span>
                          <span className="attach-dropdown-desc">PDF, TXT, CSV, JSON, ZIP</span>
                        </div>
                      </div>
                      <div
                        className="attach-dropdown-item"
                        onClick={() => {
                          setShowUrlModal(true);
                          setShowDropdown(false);
                        }}
                      >
                        <span className="attach-dropdown-icon">🔗</span>
                        <div className="attach-dropdown-info">
                          <span className="attach-dropdown-label">Add Web Link</span>
                          <span className="attach-dropdown-desc">
                            Link documentation or references
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

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

      {/* URL Dialog Modal */}
      {showUrlModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">🔗 Add Web URL</span>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowUrlModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddLink} className="modal-body">
              <div className="form-group">
                <label className="form-label">Link Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://example.com/docs"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Label / Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Reference Docs"
                  value={urlTitleInput}
                  onChange={(e) => setUrlTitleInput(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowUrlModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-accent">
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div className="lightbox-backdrop" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
              &times;
            </button>
            <img src={lightboxImage.url} alt={lightboxImage.name} className="lightbox-img" />
            <div className="lightbox-caption">
              {lightboxImage.name} ({lightboxImage.size})
            </div>
          </div>
        </div>
      )}

      {activePreviewHtml && (
        <div className="preview-modal-overlay" style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(10, 10, 11, 0.93)",
          backdropFilter: "blur(20px)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            gap: "16px",
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚡ Live Output Preview
            </span>
            <button onClick={() => setActivePreviewHtml(null)} style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "auto",
              fontWeight: 500,
              fontFamily: "var(--font-body)",
            }}>
              Close Preview
            </button>
          </div>
          <iframe
            title="Live Code Preview"
            srcDoc={activePreviewHtml}
            style={{
              flex: 1,
              width: "100%",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              background: "#ffffff",
            }}
          />
        </div>
      )}
    </div>
  );
}