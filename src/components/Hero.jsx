import React, { useState } from "react";

const QUICK_TAGS = [
  { icon: "🌀", label: "3D Scene", prompt: "Create a stunning 3D interactive scene" },
  { icon: "📊", label: "Dashboard", prompt: "Build an interactive data dashboard" },
  { icon: "✦", label: "Landing Page", prompt: "Design a minimalistic landing page" },
  { icon: "🎇", label: "Particles", prompt: "Create an animated particle system" },
  { icon: "⚙", label: "Shader", prompt: "Generate a GLSL shader animation" },
];

export default function Hero({ onSubmit }) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setValue("");
    onSubmit(trimmed);
  };

  const setPrompt = (text) => {
    setValue(text);
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

      <div className="prompt-container">
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
            <button className="tool-btn">📎 Attach</button>
            <button className="tool-btn">✨ Enhance</button>
          </div>
          <button className="send-btn" onClick={handleSubmit} title="Generate">
            ➤
          </button>
        </div>
      </div>

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