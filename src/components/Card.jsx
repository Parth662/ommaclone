import React from "react";

export default function Card({ card, onOpen, onRemix }) {
  return (
    <div className="card" onClick={() => onOpen(card)}>
      <div className="card-thumb">
        <div className={`card-thumb-placeholder ${card.color}`}>
          {card.emoji}
        </div>
        <div className="card-overlay">
          <button
            className="remix-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemix(card);
            }}
          >
            ⚡ Remix
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title">{card.title}</div>
        <div className="card-tags">
          {card.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div className="card-meta">
          <div className="meta-avatar">{card.initials}</div>
          <span>{card.author}</span>
        </div>
      </div>
    </div>
  );
}