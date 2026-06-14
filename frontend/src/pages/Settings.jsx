import React, { useState } from "react";

const TABS = [
  { id: "general",    label: "General" },
  { id: "appearance", label: "Appearance" },
  { id: "account",    label: "Account" },
  { id: "billing",    label: "Billing" },
  { id: "usage",      label: "Usage" },
  { id: "referrals",  label: "Referrals" },
];

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 42, height: 24, borderRadius: 100,
        background: checked ? "var(--green)" : "rgba(255,255,255,0.08)",
        border: checked ? "none" : "1px solid rgba(255,255,255,0.1)",
        cursor: "pointer", position: "relative",
        transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute",
        top: 3,
        left: checked ? 21 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        transition: "left 0.18s ease",
      }} />
    </div>
  );
}

function SettingRow({ label, description, children, noBorder }) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 0",
      borderBottom: noBorder ? "none" : "1px solid var(--border)",
      gap: 32,
    }}>
      <div>
        <div style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 400 }}>{label}</div>
        {description && (
          <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>{description}</div>
        )}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-hover)",
  borderRadius: 8,
  padding: "10px 14px",
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: 14,
  outline: "none",
};

const ghostBtn = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border-hover)",
  color: "var(--text-secondary)",
  padding: "7px 16px", borderRadius: 7,
  fontSize: 12.5, fontWeight: 500,
  fontFamily: "var(--font-body)",
  cursor: "pointer", whiteSpace: "nowrap",
};

function GeneralTab({ userEmail }) {
  const name = userEmail?.split("@")[0] || "user";
  const [displayName, setDisplayName] = useState(name);
  const [about, setAbout] = useState("");
  const [smartRouting, setSmartRouting] = useState(false);
  const [webSearch, setWebSearch] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>Display name</div>
        <input value={displayName} onChange={e => setDisplayName(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>About</div>
        <textarea
          value={about} onChange={e => setAbout(e.target.value)}
          rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          placeholder="Tell us about yourself..."
        />
      </div>
      <SettingRow label="Smart model routing" description="Use a lighter model for simple replies">
        <Toggle checked={smartRouting} onChange={setSmartRouting} />
      </SettingRow>
      <SettingRow label="Web search" description="Allow the AI to search the web for up-to-date information">
        <Toggle checked={webSearch} onChange={setWebSearch} />
      </SettingRow>
      <SettingRow label="Sound effects" description="Play a sound when a process completes" noBorder>
        <Toggle checked={soundEffects} onChange={setSoundEffects} />
      </SettingRow>
      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          style={{
            background: saved ? "var(--green)" : "var(--accent)",
            border: "none", color: "#fff",
            padding: "9px 22px", borderRadius: 8,
            fontSize: 13, fontWeight: 600,
            fontFamily: "var(--font-body)", cursor: "pointer",
            transition: "background 0.2s",
          }}
        >{saved ? "✓ Saved" : "Save changes"}</button>
      </div>
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("medium");
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>Theme</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { id: "dark", label: "Dark", bg: "#0a0a0b" },
            { id: "darker", label: "Darker", bg: "#050507" },
            { id: "midnight", label: "Midnight", bg: "#0d1117" },
          ].map(t => (
            <div key={t.id} style={{ textAlign: "center" }}>
              <div
                onClick={() => setTheme(t.id)}
                style={{
                  width: 76, height: 48, borderRadius: 8,
                  background: t.bg,
                  border: theme === t.id ? "2px solid var(--accent)" : "2px solid rgba(255,255,255,0.07)",
                  cursor: "pointer", marginBottom: 6,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 4,
                  transition: "border 0.15s",
                }}
              >
                <div style={{ width: 30, height: 3, borderRadius: 2, background: "var(--accent)", opacity: 0.8 }} />
                <div style={{ width: 22, height: 2, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
              </div>
              <div style={{ fontSize: 11.5, color: theme === t.id ? "var(--text-primary)" : "var(--text-muted)" }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
      <SettingRow label="Font size" description="Interface text size">
        <div style={{ display: "flex", gap: 6 }}>
          {["Small","Medium","Large"].map(s => (
            <button key={s} onClick={() => setFontSize(s.toLowerCase())} style={{
              background: fontSize === s.toLowerCase() ? "rgba(123,110,246,0.15)" : "var(--bg-elevated)",
              border: fontSize === s.toLowerCase() ? "1px solid rgba(123,110,246,0.4)" : "1px solid var(--border)",
              color: fontSize === s.toLowerCase() ? "#a78bfa" : "var(--text-secondary)",
              padding: "5px 14px", borderRadius: 7,
              fontSize: 12.5, fontFamily: "var(--font-body)",
              cursor: "pointer", transition: "all 0.15s",
            }}>{s}</button>
          ))}
        </div>
      </SettingRow>
      <SettingRow label="Code font" description="Font used in code blocks" noBorder>
        <select style={{ ...ghostBtn }}>
          <option>System Mono</option>
          <option>Fira Code</option>
          <option>JetBrains Mono</option>
        </select>
      </SettingRow>
    </div>
  );
}

function AccountTab({ userEmail }) {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>Email address</div>
        <input value={userEmail || "user@omma.build"} readOnly style={{ ...inputStyle, opacity: 0.55, cursor: "not-allowed" }} />
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Contact support to change your email.</div>
      </div>
      <SettingRow label="Password" description="Change your account password">
        <button style={ghostBtn}>Update</button>
      </SettingRow>
      <SettingRow label="Two-factor authentication" description="Add an extra layer of security">
        <button style={ghostBtn}>Enable</button>
      </SettingRow>
      <SettingRow label="Connected accounts" description="Link Google, GitHub or other providers" noBorder>
        <button style={ghostBtn}>Manage</button>
      </SettingRow>
      <div style={{ marginTop: 32, padding: 18, borderRadius: 10, border: "1px solid rgba(240,106,106,0.18)", background: "rgba(240,106,106,0.04)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#f06a6a", marginBottom: 5 }}>Danger zone</div>
        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 14 }}>Permanently delete your account and all data. Cannot be undone.</div>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} style={{ background: "transparent", border: "1px solid rgba(240,106,106,0.35)", color: "#f06a6a", padding: "7px 16px", borderRadius: 7, fontSize: 12.5, fontFamily: "var(--font-body)", cursor: "pointer" }}>
            Delete account
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>Are you sure?</span>
            <button style={{ background: "#f06a6a", border: "none", color: "#fff", padding: "7px 14px", borderRadius: 7, fontSize: 12.5, fontFamily: "var(--font-body)", cursor: "pointer" }}>Yes, delete</button>
            <button onClick={() => setShowDelete(false)} style={ghostBtn}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div>
      <div style={{ padding: 18, borderRadius: 10, border: "1px solid var(--border-hover)", background: "var(--bg-card)", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 3 }}>Current plan</div>
          <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "var(--font-head)", color: "var(--text-primary)" }}>Free</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>0 credits remaining</div>
        </div>
        <button style={{ background: "var(--accent)", border: "none", color: "#fff", padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer" }}>Upgrade</button>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Credits used</span>
          <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>0 / 0</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: "var(--bg-elevated)" }}>
          <div style={{ width: "0%", height: "100%", background: "var(--accent)", borderRadius: 3 }} />
        </div>
      </div>
      <SettingRow label="Payment method" description="No payment method added"><button style={ghostBtn}>Add card</button></SettingRow>
      <SettingRow label="Billing history" description="View and download past invoices"><button style={ghostBtn}>View all</button></SettingRow>
      <SettingRow label="Billing email" description="Receipts sent to your account email" noBorder><button style={ghostBtn}>Edit</button></SettingRow>
    </div>
  );
}

function UsageTab() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const values = [12, 30, 18, 45, 27, 0];
  const max = 50;
  return (
    <div>
      <div style={{ padding: 18, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-card)", marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Total credits used</div>
        <div style={{ fontSize: 34, fontWeight: 700, fontFamily: "var(--font-head)", letterSpacing: -1.5, color: "var(--text-primary)" }}>132</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Since account creation</div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 14 }}>Monthly usage</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 88 }}>
          {months.map((m, i) => (
            <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: "100%",
                height: `${(values[i] / max) * 72}px`,
                minHeight: 4, borderRadius: "3px 3px 0 0",
                background: i === 5 ? "rgba(123,110,246,0.18)" : "linear-gradient(180deg, #7b6ef6 0%, rgba(123,110,246,0.35) 100%)",
              }} />
              <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
      <SettingRow label="API requests" description="Total requests made via API"><span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>0</span></SettingRow>
      <SettingRow label="Components generated" description="Total AI-generated components"><span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>7</span></SettingRow>
      <SettingRow label="Chats started" description="Total conversations" noBorder><span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>4</span></SettingRow>
    </div>
  );
}

function ReferralsTab({ userEmail }) {
  const code = (userEmail?.split("@")[0] || "user").toUpperCase().slice(0, 8) + "REF";
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div style={{ padding: 22, borderRadius: 12, background: "linear-gradient(135deg, rgba(123,110,246,0.1), rgba(94,234,212,0.05))", border: "1px solid rgba(123,110,246,0.2)", marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 26, marginBottom: 8 }}>🎁</div>
        <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "var(--font-head)", color: "var(--text-primary)", marginBottom: 5 }}>Invite friends, earn credits</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 320, margin: "0 auto" }}>When a friend signs up and creates their first project, you both get 50 free credits.</div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 8 }}>Your referral link</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input readOnly value={`https://omma.build/ref/${code}`} style={{ ...inputStyle, flex: 1, opacity: 0.65 }} />
          <button onClick={() => { navigator.clipboard.writeText(`https://omma.build/ref/${code}`).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); }} style={{ background: copied ? "var(--green)" : "var(--accent)", border: "none", color: "#fff", padding: "0 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>{copied ? "✓ Copied" : "Copy"}</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[["Referrals sent","0"],["Signed up","0"],["Credits earned","0"]].map(([label, value]) => (
          <div key={label} style={{ padding: 14, borderRadius: 9, background: "var(--bg-card)", border: "1px solid var(--border)", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-head)", letterSpacing: -0.8, color: "var(--text-primary)" }}>{value}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>Credits are added within 24 hours of a successful referral. Max 500 credits per account.</div>
    </div>
  );
}

export default function Settings({ userEmail }) {
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "general":    return <GeneralTab userEmail={userEmail} />;
      case "appearance": return <AppearanceTab />;
      case "account":    return <AccountTab userEmail={userEmail} />;
      case "billing":    return <BillingTab />;
      case "usage":      return <UsageTab />;
      case "referrals":  return <ReferralsTab userEmail={userEmail} />;
      default:           return null;
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-base)" }}>

      {/* Header row — matches Omma's "⊞ Settings" topbar style */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 28px",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)" }}>Settings</span>
      </div>

      {/* Two-column layout — centred card, max 680px, matches original */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ display: "flex", width: "100%", maxWidth: 680, gap: 0 }}>

          {/* Left: tab list, same muted style as original */}
          <div style={{ width: 144, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "transparent", border: "none",
                  color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                  fontSize: 14, fontWeight: 400,
                  padding: "8px 12px 8px 16px",
                  borderRadius: 0, cursor: "pointer",
                  textAlign: "left", transition: "color 0.12s",
                  position: "relative",
                }}
              >
                {activeTab === tab.id && (
                  <span style={{
                    position: "absolute", left: 0,
                    top: "50%", transform: "translateY(-50%)",
                    width: 2, height: 14,
                    background: "var(--text-primary)",
                    borderRadius: "0 2px 2px 0",
                  }} />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right: content panel */}
          <div style={{
            flex: 1, overflowY: "auto",
            paddingLeft: 32,
            scrollbarWidth: "thin",
            scrollbarColor: "var(--bg-elevated) transparent",
          }}>
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}