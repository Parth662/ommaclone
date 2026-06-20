import React from "react";

export default function Topbar({ title, onUpgrade, onNavigate, chatCredits = 500, projectCredits = 100 }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="breadcrumb">Forge AI</span>
        <span className="breadcrumb" style={{ margin: "0 2px" }}>/</span>
        <span className="breadcrumb-active">{title}</span>
      </div>
      <div className="topbar-right">
        <div
          className="credits-badge credits-badge-clickable"
          onClick={onUpgrade}
          title="Upgrade plan"
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <div className="credits-dot" />
          <span>💬 {chatCredits}</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>⚡ {projectCredits}</span>
        </div>
        <button
          className="icon-btn"
          title="Notifications"
          onClick={() => onNavigate?.("notifications")}
        >
          🔔
        </button>
        <button
          className="icon-btn"
          title="Settings"
          onClick={() => onNavigate?.("settings")}
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}