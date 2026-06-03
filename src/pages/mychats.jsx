import React, { useState } from "react";

const INITIAL_CHATS = [
  {
    id: "grimoire",
    title: "Enchanted AI Grimoire 3D Experience",
    timeAgo: "2d ago",
    messagesCount: 3,
    image: "/grimoire_3d_thumbnail.png",
    favorite: false,
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk Landing Interface",
    timeAgo: "4d ago",
    messagesCount: 12,
    image: "/cyberpunk_canvas_thumbnail.png",
    favorite: true,
  },
  {
    id: "modular",
    title: "Modular Asset Architecture",
    timeAgo: "Oct 24",
    messagesCount: 5,
    image: "/modular_architecture_thumbnail.png",
    favorite: false,
  },
];

export default function MyChats({ onOpenChat }) {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeTab, setActiveTab] = useState("chats"); // "chats" or "favorites"
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setChats(
      chats.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))
    );
  };

  const filteredChats = chats.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "chats" || c.favorite;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="mychats-page">
      {/* Custom Header Bar */}
      <header className="mychats-header">
        <div className="mychats-header-left">
          <button className="mychats-toggle-btn" title="Toggle Sidebar">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </button>

          <div className="mychats-tabs">
            <button
              className={`mychats-tab-btn ${activeTab === "chats" ? "active" : ""}`}
              onClick={() => setActiveTab("chats")}
            >
              My Chats
            </button>
            <button
              className={`mychats-tab-btn ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              Favorites
            </button>
          </div>
        </div>

        <div className="mychats-header-center">
          <div className="mychats-search-wrapper">
            <svg
              className="search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mychats-search-input"
            />
          </div>
        </div>

        <div className="mychats-header-right">
          <button className="mychats-content-btn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "6px" }}
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            Content
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="mychats-content">
        {filteredChats.length === 0 ? (
          <div className="mychats-empty">
            <div className="empty-icon">📂</div>
            <h3>No chats found</h3>
            <p>Try searching for something else or add some chats to your favorites.</p>
          </div>
        ) : (
          <div className="mychats-grid">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="mychats-card"
                onClick={() => onOpenChat(chat.id)}
              >
                <div className="mychats-card-thumb">
                  <img
                    src={chat.image}
                    alt={chat.title}
                    className="mychats-card-img"
                  />
                  <button
                    className={`mychats-fav-btn ${chat.favorite ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(chat.id, e)}
                    title={chat.favorite ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={chat.favorite ? "var(--amber)" : "none"}
                      stroke={chat.favorite ? "var(--amber)" : "white"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                </div>
                <div className="mychats-card-body">
                  <h4 className="mychats-card-title" title={chat.title}>
                    {chat.title}
                  </h4>
                  <div className="mychats-card-meta">
                    <span className="mychats-card-time">{chat.timeAgo}</span>
                    <span className="mychats-card-dot">•</span>
                    <span className="mychats-card-count">
                      {chat.messagesCount} {chat.messagesCount === 1 ? "message" : "messages"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
