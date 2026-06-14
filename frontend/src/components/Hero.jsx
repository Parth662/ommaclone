import React, { useState, useRef } from "react";

const QUICK_TAGS = [
  { icon: "🌀", label: "3D Scene", prompt: "Create a stunning 3D interactive scene" },
  { icon: "📊", label: "Dashboard", prompt: "Build an interactive data dashboard" },
  { icon: "✦", label: "Landing Page", prompt: "Design a minimalistic landing page" },
  { icon: "🎇", label: "Particles", prompt: "Create an animated particle system" },
  { icon: "⚙", label: "Shader", prompt: "Generate a GLSL shader animation" },
];

export default function Hero({ onSubmit }) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlTitleInput, setUrlTitleInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed && attachments.length === 0) return;
    setValue("");
    onSubmit(trimmed, attachments);
    setAttachments([]);
  };

  const setPrompt = (text) => {
    setValue(text);
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
    e.target.value = ""; // reset input
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
    e.target.value = ""; // reset input
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
    <div className="hero">
      <div className="hero-eyebrow">
        <span className="hero-dot" />
        AI-Powered Studio
      </div>
      <h1 className="hero-title">
        Build <span className="highlight">Anything</span>
        <br />
        Ship Faster
      </h1>
      <p className="hero-sub">
        Describe what you want to create. Your AI studio turns ideas into
        polished, production-ready experiences.
      </p>

      {/* Hidden inputs */}
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
                    <div className="attachment-name" title={item.name}>{item.name}</div>
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
            placeholder="Describe what you want to build…"
            rows={2}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
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
                        <span className="attach-dropdown-desc">Link documentation or references</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button type="button" className="tool-btn">✨ Enhance</button>
            </div>
            <button className="send-btn" onClick={handleSubmit} title="Generate">
              ➤
            </button>
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

      <div className="quick-tags">
        {QUICK_TAGS.map((qt) => (
          <div
            key={qt.label}
            className="qtag"
            onClick={() => setPrompt(qt.prompt)}
          >
            <span className="qtag-icon">{qt.icon}</span>
            {qt.label}
          </div>
        ))}
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">48K+</div>
          <div className="stat-label">Projects Built</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">12K+</div>
          <div className="stat-label">Creators</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">99ms</div>
          <div className="stat-label">Avg. Response</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">4.9★</div>
          <div className="stat-label">Satisfaction</div>
        </div>
      </div>
    </div>
  );
}