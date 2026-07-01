import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Trash({ onRestore }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [confirmEmpty, setConfirmEmpty] = useState(false);

  const fetchTrash = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/chats/trash`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setItems(response.data.items || []);
      }
    } catch (err) {
      console.error("Error fetching trash:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE_URL}/chats/${id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        onRestore?.();
      }
    } catch (err) {
      console.error("Error restoring chat:", err);
      alert("Failed to restore chat.");
    }
  };

  const handleDeletePermanently = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/chats/${id}/forever`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Error permanently deleting chat:", err);
      alert("Failed to delete chat permanently.");
    }
  };

  const handleEmptyTrash = async () => {
    if (confirmEmpty) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${API_BASE_URL}/chats/trash/empty`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setItems([]);
        }
      } catch (err) {
        console.error("Error emptying trash:", err);
        alert("Failed to empty trash.");
      }
      setConfirmEmpty(false);
    } else {
      setConfirmEmpty(true);
      setTimeout(() => setConfirmEmpty(false), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 64px)", background: "var(--bg-base)" }}>
        <div className="auth-spinner">
          <div className="spinner-outer" />
          <div className="spinner-inner" />
          <span className="spinner-icon">⚡</span>
        </div>
      </div>
    );
  }

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