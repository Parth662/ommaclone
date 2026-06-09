import { useState } from "react";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "credit",
    icon: "⚡",
    title: "Credits running low",
    body: "You have 0 credits left. Upgrade to keep building.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    type: "referral",
    icon: "🎁",
    title: "Referral bonus available",
    body: "Invite a friend and you both get 50 free credits.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    type: "community",
    icon: "🌐",
    title: "Your project was remixed",
    body: "Someone remixed your Enchanted AI Grimoire 3D project.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    type: "system",
    icon: "🚀",
    title: "New feature: Particles",
    body: "Particle system builder is now live. Try it in a new chat.",
    time: "3 days ago",
    unread: false,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [hoveredId, setHoveredId] = useState(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const dismissOne = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg-base)",
      }}
    >
      {/* Page body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px 28px",
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "var(--font-head)",
                color: "var(--text-primary)",
                margin: "0 0 4px",
                letterSpacing: -0.4,
              }}
            >
              Notifications
              {unreadCount > 0 && (
                <span
                  style={{
                    marginLeft: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "var(--font-body)",
                    padding: "3px 8px",
                    borderRadius: 20,
                    background: "rgba(123,110,246,0.18)",
                    color: "var(--accent)",
                    verticalAlign: "middle",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                margin: 0,
              }}
            >
              Updates about your projects, credits, and activity.
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border-hover)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                }}
              >
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid rgba(240,106,106,0.25)",
                  background: "transparent",
                  color: "var(--red)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {notifications.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              🔕
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "var(--font-head)",
                  color: "var(--text-primary)",
                  margin: "0 0 6px",
                }}
              >
                You're all caught up
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  margin: 0,
                }}
              >
                No new notifications right now.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onMouseEnter={() => setHoveredId(n.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "16px 18px",
                  borderRadius: 12,
                  background: n.unread
                    ? "rgba(123,110,246,0.05)"
                    : hoveredId === n.id
                    ? "var(--bg-hover)"
                    : "var(--bg-surface)",
                  border: `1px solid ${
                    n.unread ? "rgba(123,110,246,0.15)" : "var(--border)"
                  }`,
                  transition: "background 0.12s ease",
                  position: "relative",
                }}
              >
                {/* Unread indicator */}
                {n.unread && (
                  <span
                    style={{
                      position: "absolute",
                      left: 7,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--accent)",
                    }}
                  />
                )}

                {/* Icon */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {n.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: n.unread ? 600 : 400,
                      fontFamily: "var(--font-body)",
                      color: "var(--text-primary)",
                      margin: "0 0 4px",
                      lineHeight: 1.4,
                    }}
                  >
                    {n.title}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-body)",
                      margin: "0 0 6px",
                      lineHeight: 1.5,
                    }}
                  >
                    {n.body}
                  </p>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {n.time}
                  </span>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={() => dismissOne(n.id)}
                  title="Dismiss"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: 1,
                    padding: "2px 4px",
                    flexShrink: 0,
                    borderRadius: 6,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}