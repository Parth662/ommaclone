import React, { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { icon: "🧭", label: "Discover", page: "discover" },
  { icon: "💬", label: "My Chats", page: "chats" },
  { icon: "⬚", label: "Components", page: "components" },
  { icon: "🌐", label: "Community", page: "community" },
  { icon: "🔍", label: "Search", page: "search" },
];

export default function Sidebar({ activePage, onNavigate, onOpenChat, onUpgrade, isPro = false, userEmail = "guest@omma.build", chatCredits = 500, projectCredits = 100, recentChats = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const popoverRef = useRef(null);

  const displayName = userEmail.split("@")[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-profile-box")
      ) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">Omma</div>
      </div>

      <button className="new-chat-btn" onClick={() => onOpenChat("new")}>
        <span className="plus">+</span> New Chat
      </button>

      <div className="nav-section">
        <nav>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.page}
              className={`nav-item${activePage === item.page ? " active" : ""}`}
              onClick={() => onNavigate(item.page)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="nav-label">RECENT</div>
        {recentChats && recentChats.length > 0 ? (
          recentChats.map((chat) => (
            <div
              key={chat.id}
              className="recent-chat-item"
              onClick={() => onOpenChat(chat.id)}
            >
              <div className="recent-chat-title">{chat.title}</div>
              <div className="recent-chat-sub">{chat.messagesCount} messages · {chat.timeAgo}</div>
            </div>
          ))
        ) : (
          <div style={{ padding: "8px 16px", fontSize: 11.5, color: "var(--text-muted)", fontStyle: "italic" }}>
            No recent chats
          </div>
        )}
      </div>

      <div className="sidebar-footer-container">
        {isMenuOpen && (
          <div className="sidebar-popover-menu" ref={popoverRef} onClick={(e) => e.stopPropagation()}>

            {/* My Profile */}
            <div className="popover-item" onClick={() => { setIsMenuOpen(false); onNavigate("profile"); }}>
              <span className="popover-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <span>My Profile</span>
            </div>

            {/* Settings */}
            <div className="popover-item" onClick={() => { setIsMenuOpen(false); onNavigate("settings"); }}>
              <span className="popover-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </span>
              <span>Settings</span>
            </div>

            {/* Trash — always accessible */}
            <div
              className="popover-item"
              onClick={() => { setIsMenuOpen(false); onNavigate("trash"); }}
            >
              <span className="popover-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </span>
              <span>Trash</span>
            </div>

            <hr className="popover-divider" />

            {/* Create team — navigates to page; gating handled inside CreateTeam.jsx */}
            <div
              className="popover-item"
              style={{ opacity: isPro ? 1 : 0.55 }}
              onClick={() => { setIsMenuOpen(false); onNavigate("createteam"); }}
            >
              <span className="popover-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </span>
              <span>Create team</span>
              {!isPro && (
                <span style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "rgba(123,110,246,0.15)",
                  color: "var(--accent)",
                  letterSpacing: 0.4,
                }}>
                  PRO
                </span>
              )}
            </div>

            <hr className="popover-divider" />

            {/* Docs */}
            <div className="popover-item" onClick={() => { setIsMenuOpen(false); onNavigate("docs"); }}>
              <span className="popover-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </span>
              <span>Docs</span>
            </div>

            {/* Upgrade */}
            <div
              className="popover-item"
              onClick={() => {
                setIsMenuOpen(false);
                onUpgrade?.();
              }}
            >
              <span className="popover-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline></svg>
              </span>
              <span>Upgrade</span>
            </div>

            <hr className="popover-divider" />

            {/* Log Out */}
            <div className="popover-item logout" onClick={() => { setIsMenuOpen(false); onNavigate("login"); }}>
              <span className="popover-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </span>
              <span>Log Out</span>
            </div>
          </div>
        )}

        <div className="sidebar-credits-box" onClick={onUpgrade} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span className="credits-text" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}>
              🪙 {chatCredits} credits
            </span>
            <span className="credits-text" style={{ fontSize: 10, opacity: 0.65, display: "flex", alignItems: "center", gap: 5 }}>
              Resets daily
            </span>
          </div>
          <span className="free-badge">{isPro ? "PRO" : "FREE"}</span>
        </div>

        <div className="sidebar-profile-box" onClick={toggleMenu}>
          <div className="avatar-small silhouette">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className="profile-name">{displayName}</div>
          <span className="profile-chevron">↕</span>
        </div>
      </div>
    </aside>
  );
}