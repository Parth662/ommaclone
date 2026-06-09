import { useState } from "react";

const MOCK_TRASH = [
  {
    id: 1,
    title: "Enchanted AI Grimoire 3D",
    type: "chat",
    deletedAt: "Jun 7, 2026",
  },
  {
    id: 2,
    title: "Landing Page Component",
    type: "component",
    deletedAt: "Jun 5, 2026",
  },
  {
    id: 3,
    title: "Dark Mode Toggle",
    type: "component",
    deletedAt: "Jun 3, 2026",
  },
];

export default function Trash() {
  const [items, setItems] = useState(MOCK_TRASH);
  const [hoveredId, setHoveredId] = useState(null);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  const handleRestore = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeletePermanently = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEmptyTrash = () => {
    if (confirmEmpty) {
      setItems([]);
      setConfirmEmpty(false);
    } else {
      setConfirmEmpty(true);
      setTimeout(() => setConfirmEmpty(false), 3000);
    }
  };

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
        }}
      >
        {/* Section header */}
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
                margin: 0,
                letterSpacing: -0.4,
              }}
            >
              Trash
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                margin: "4px 0 0",
              }}
            >
              Items are permanently deleted after 30 days.
            </p>
          </div>

          <button
            onClick={handleEmptyTrash}
            disabled={items.length === 0}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${
                confirmEmpty
                  ? "var(--red)"
                  : items.length === 0
                  ? "var(--border)"
                  : "rgba(240,106,106,0.35)"
              }`,
              background: confirmEmpty
                ? "rgba(240,106,106,0.15)"
                : "transparent",
              color:
                items.length === 0 ? "var(--text-muted)" : "var(--red)",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              cursor: items.length === 0 ? "not-allowed" : "pointer",
              transition: "all 0.15s ease",
              opacity: items.length === 0 ? 0.45 : 1,
            }}
          >
            {confirmEmpty ? "Click again to confirm" : "Empty Trash"}
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
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
              🗑️
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
                Your trash is empty
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  margin: 0,
                }}
              >
                Deleted chats and components will appear here.
              </p>
            </div>
          </div>
        ) : (
          /* Trash item list */
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderRadius: 10,
                  background:
                    hoveredId === item.id
                      ? "var(--bg-hover)"
                      : "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  transition: "background 0.12s ease",
                }}
              >
                {/* Left: icon + info */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {item.type === "chat" ? "💬" : "⚡"}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: "var(--font-body)",
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-body)",
                        margin: "3px 0 0",
                      }}
                    >
                      {item.type === "chat" ? "Chat" : "Component"} · Deleted{" "}
                      {item.deletedAt}
                    </p>
                  </div>
                </div>

                {/* Right: action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => handleRestore(item.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 7,
                      border: "1px solid var(--border-hover)",
                      background: "transparent",
                      color: "var(--text-secondary)",
                      fontSize: 12,
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                    }}
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDeletePermanently(item.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 7,
                      border: "1px solid rgba(240,106,106,0.25)",
                      background: "transparent",
                      color: "var(--red)",
                      fontSize: 12,
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                    }}
                  >
                    Delete forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}