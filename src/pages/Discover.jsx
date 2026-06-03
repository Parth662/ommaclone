import React, { useState } from "react";
import Hero from "../components/Hero.jsx";
import Card from "../components/Card.jsx";
import { CARDS_DATA } from "../data/data.js";

const FILTERS = [
  { key: "all", label: "✦ All" },
  { key: "3d", label: "🌀 3D & WebGL" },
  { key: "motion", label: "✨ Motion" },
  { key: "ui", label: "🎨 UI & Layout" },
  { key: "game", label: "🎮 Games" },
  { key: "data", label: "📊 Charts & Data" },
  { key: "ai", label: "🤖 AI" },
  { key: "landing", label: "🌐 Landing Pages" },
  { key: "shader", label: "⚙ Shaders" },
  { key: "creative", label: "🎭 Creative" },
];

export default function Discover({ onOpenChat, onNavigateCommunity }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? CARDS_DATA
      : CARDS_DATA.filter((c) => c.cat === activeFilter);

  const handleHeroSubmit = (text) => {
    onOpenChat("new", text);
  };

  return (
    <div className="content">
      <Hero onSubmit={handleHeroSubmit} />

      <div className="community-section">
        <div className="section-header">
          <div>
            <div className="section-title">Community Showcase</div>
            <div className="section-sub">
              Explore and remix creations from the community
            </div>
          </div>
          <div className="view-all" onClick={onNavigateCommunity}>
            View all →
          </div>
        </div>

        <div className="filter-row">
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