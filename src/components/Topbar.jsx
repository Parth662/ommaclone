import React from "react";

export default function Topbar({ title, onUpgrade }) {
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
        >
          <div className="credits-dot" />
          0 credits
        </div>
        <button className="icon-btn" title="Notifications">🔔</button>
        <button className="icon-btn" title="Settings">⚙️</button>
      </div>
    </div>
  );
}