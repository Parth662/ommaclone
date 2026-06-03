import React, { useState } from "react";
import Card from "../components/Card.jsx";
import { CARDS_DATA } from "../data/data.js";

const FILTERS = [
  { key: "all", label: "✦ All" },
  { key: "3d", label: "🌀 3D" },
  { key: "ui", label: "🎨 UI" },
  { key: "game", label: "🎮 Games" },
  { key: "ai", label: "🤖 AI" },
];

export default function Community({ onOpenChat }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? CARDS_DATA
      : CARDS_DATA.filter((c) => c.cat === activeFilter);

  return (
    <div className="content">
      <div style={{ marginTop: 32 }}>
        <h2 className="page-section-title">Community</h2>
        <p className="page-section-sub">
          Explore thousands of community projects
        </p>

        <div className="filter-row" style={{ marginTop: 20 }}>
          {FILTERS.map((f) => (
            <div
              key={f.key}
              className={`fchip${activeFilter === f.key ? " active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </div>
          ))}
        </div>

        <div className="grid">
          {filtered.map((card) => (
            <Card
              key={card.id}
              card={card}
              onOpen={(c) => onOpenChat(`card-${c.id}`)}
              onRemix={(c) => onOpenChat(`remix-${c.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}