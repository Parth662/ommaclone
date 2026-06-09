import { useState } from "react";




const EMOJI_OPTIONS = ["🚀", "⚡", "🔥", "💡", "🌙", "🎯", "🛸", "🧠", "🌊", "🎨"];

export default function CreateTeam({ userEmail = "google.user", isPro = false, onUpgrade, onNavigate }) {
  

  const [teamName, setTeamName] = useState("");
  const [slug, setSlug] = useState("");
  const [avatar, setAvatar] = useState("🚀");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [invites, setInvites] = useState([]);
  const [inviteError, setInviteError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Auto-generate slug from team name
  const handleTeamNameChange = (val) => {
    setTeamName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
  };

  const handleAddInvite = () => {
    const email = inviteInput.trim();
    if (!email) return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setInviteError("Enter a valid email address.");
      return;
    }
    if (invites.includes(email)) {
      setInviteError("Already added.");
      return;
    }
    setInvites((prev) => [...prev, email]);
    setInviteInput("");
    setInviteError("");
  };

  const handleRemoveInvite = (email) => {
    setInvites((prev) => prev.filter((e) => e !== email));
  };

  const handleSubmit = () => {
    if (!teamName.trim()) return;
    setSubmitted(true);
  };

  // ─── Subscription gate ───────────────────────────────────────────────
  if (!isPro) {
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
        {/* Gate card */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 36,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(123,110,246,0.2) 0%, rgba(123,110,246,0.05) 100%)",
                border: "1px solid rgba(123,110,246,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              👥
            </div>

            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: "var(--font-head)",
                  color: "var(--text-primary)",
                  margin: "0 0 8px",
                  letterSpacing: -0.3,
                }}
              >
                Teams require a paid plan
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Upgrade to Pro or Team to create a shared workspace, invite teammates, and collaborate on projects.
              </p>
            </div>

            <div
              style={{
                width: "100%",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {["Shared team workspace", "Invite unlimited teammates", "Shared credits pool", "Priority support"].map(
                (feat) => (
                  <div
                    key={feat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 13,
                      fontFamily: "var(--font-body)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span style={{ color: "var(--green)", fontSize: 14 }}>✓</span>
                    {feat}
                  </div>
                )
              )}
            </div>

            <button
              style={{
                width: "100%",
                padding: "11px 0",
                borderRadius: 9,
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                letterSpacing: 0.1,
              }}
              onClick={() => onUpgrade?.()}
            >
              Upgrade to unlock Teams →
            </button>

            <p
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                margin: 0,
              }}
            >
              Already subscribed?{" "}
              <span
                style={{ color: "var(--accent)", cursor: "pointer" }}
                onClick={() => alert("Refresh or contact support")}
              >
                Refresh your plan
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Success state ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base)",
        }}
      >
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 48 }}>{avatar}</div>
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "var(--font-head)",
                color: "var(--text-primary)",
                margin: "0 0 8px",
              }}
            >
              {teamName} is ready!
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                fontFamily: "var(--font-body)",
                margin: 0,
              }}
            >
              omma.build/t/{slug}
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setTeamName("");
              setSlug("");
              setAvatar("🚀");
              setInvites([]);
            }}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid var(--border-hover)",
              background: "transparent",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            Create another
          </button>
        </div>
      </div>
    );
  }

  // ─── Main form ────────────────────────────────────────────────────────
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
      {/* Form area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Title */}
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
              Create a team workspace
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-body)", margin: 0 }}>
              Collaborate with teammates on shared projects.
            </p>
          </div>

          {/* Avatar + team name row */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            {/* Avatar picker */}
            <div style={{ position: "relative" }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 6 }}>
                Avatar
              </label>
              <button
                onClick={() => setShowEmojiPicker((v) => !v)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  border: "1px solid var(--border-hover)",
                  background: "var(--bg-elevated)",
                  fontSize: 22,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {avatar}
              </button>
              {showEmojiPicker && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: 10,
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 4,
                    zIndex: 100,
                  }}
                >
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      onClick={() => {
                        setAvatar(em);
                        setShowEmojiPicker(false);
                      }}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 6,
                        border: avatar === em ? "1.5px solid var(--accent)" : "1px solid transparent",
                        background: avatar === em ? "rgba(123,110,246,0.12)" : "transparent",
                        fontSize: 18,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Team name */}
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 6 }}>
                Team name
              </label>
              <input
                value={teamName}
                onChange={(e) => handleTeamNameChange(e.target.value)}
                placeholder="Acme Inc."
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Team URL slug */}
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 6 }}>
              Team URL
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid var(--border)",
                borderRadius: 8,
                background: "var(--bg-elevated)",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  padding: "10px 12px",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  color: "var(--text-muted)",
                  background: "var(--bg-card)",
                  borderRight: "1px solid var(--border)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                omma.build/t/
              </span>
              <input
                value={slug}
                onChange={(e) =>
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                placeholder="acme-inc"
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  minWidth: 0,
                }}
              />
            </div>
          </div>

          {/* Invite teammates */}
          <div>
            <label style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-body)", display: "block", marginBottom: 6 }}>
              Invite teammates
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={inviteInput}
                onChange={(e) => {
                  setInviteInput(e.target.value);
                  setInviteError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAddInvite()}
                placeholder="teammate@example.com"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: `1px solid ${inviteError ? "var(--red)" : "var(--border)"}`,
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  minWidth: 0,
                }}
              />
              <button
                onClick={handleAddInvite}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid var(--border-hover)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Add
              </button>
            </div>
            {inviteError && (
              <p style={{ fontSize: 12, color: "var(--red)", fontFamily: "var(--font-body)", margin: "5px 0 0" }}>
                {inviteError}
              </p>
            )}

            {/* Invite chips */}
            {invites.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {invites.map((email) => (
                  <div
                    key={email}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 10px",
                      borderRadius: 20,
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      fontSize: 12,
                      fontFamily: "var(--font-body)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {email}
                    <span
                      onClick={() => handleRemoveInvite(email)}
                      style={{ cursor: "pointer", color: "var(--text-muted)", fontSize: 14, lineHeight: 1 }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)" }} />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!teamName.trim()}
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: 9,
              border: "none",
              background: teamName.trim() ? "var(--accent)" : "var(--bg-elevated)",
              color: teamName.trim() ? "#fff" : "var(--text-muted)",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: teamName.trim() ? "pointer" : "not-allowed",
              transition: "background 0.15s ease",
              letterSpacing: 0.1,
            }}
          >
            Create Team
          </button>
        </div>
      </div>
    </div>
  );
}