import React, { useState } from "react";
import Card from "../components/Card.jsx";
import { CARDS_DATA } from "../data/data.js";

const TRENDING = ["3D scene", "dashboard", "landing page", "particle system", "shader"];

export default function Search({ onOpenChat }) {
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? CARDS_DATA.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : CARDS_DATA;

  return (
    <div className="content">
      <div style={{ marginTop: 32 }}>
        <h2 className="page-section-title">Search</h2>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search components, templates, creators…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div
          style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}
        >
          Trending
        </div>
        <div className="trending">
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>🔥</span>
          {TRENDING.map((t) => (
            <div
              key={t}
              className="fchip"
              onClick={() => setQuery(t)}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="grid" style={{ marginTop: 28 }}>
          {results.map((card) => (
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