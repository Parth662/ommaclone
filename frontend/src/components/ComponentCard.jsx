import React from "react";

export default function ComponentCard({ comp, onClick }) {
  return (
    <div className="comp-card" onClick={onClick}>
      <div className="comp-icon" style={{ background: comp.bg }}>
        {comp.icon}
      </div>
      <div className="comp-name">{comp.name}</div>
      <div className="comp-desc">{comp.desc}</div>
    </div>
  );
}