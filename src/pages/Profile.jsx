import React, { useState, useEffect } from "react";
import "./Profile.css";

export default function Profile({ userEmail, onBack }) {
  const [activeTab, setActiveTab] = useState("activity"); // "activity" or "logins"
  const [credits, setCredits] = useState(25);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const displayName = userEmail ? userEmail.split("@")[0] : "guest";

  // Mock activity logs
  const activityLogs = [
    {
      id: 1,
      type: "generation",
      action: "Created 3D Scene",
      details: "Generated Cyberpunk Landing Interface with hologram wireframes",
      timestamp: "Today, 3:15 PM",
      icon: "📦"
    },
    {
      id: 2,
      type: "edit",
      action: "Modified Code",
      details: "Optimized materials and lighting on Enchanted AI Grimoire",
      timestamp: "Yesterday, 6:45 PM",
      icon: "⚙️"
    },
    {
      id: 3,
      type: "upload",
      action: "Uploaded Asset",
      details: "Imported drone_v2.glb model (3.4 MB) to model library",
      timestamp: "Jun 4, 2026, 11:22 AM",
      icon: "📤"
    },
    {
      id: 4,
      type: "export",
      action: "Exported Project",
      details: "Downloaded HTML/CSS code bundle for Modular Asset Dashboard",
      timestamp: "Jun 2, 2026, 4:10 PM",
      icon: "⚡"
    },
    {
      id: 5,
      type: "auth",
      action: "Account Setup",
      details: "Registered and secured account via email verification code",
      timestamp: "Jun 2, 2026, 4:00 PM",
      icon: "🛡️"
    }
  ];

  // Mock login logs (including the current active session!)
  const loginLogs = [
    {
      id: 1,
      time: "Today, 3:35 PM",
      device: "MacBook Pro - Chrome (macOS)",
      location: "Mumbai, India",
      ip: "103.44.82.11",
      status: "Active",
      active: true
    },
    {
      id: 2,
      time: "Today, 9:55 AM",
      device: "MacBook Pro - Chrome (macOS)",
      location: "Mumbai, India",
      ip: "103.44.82.11",
      status: "Success",
      active: false
    },
    {
      id: 3,
      time: "Jun 3, 2026, 6:30 PM",
      device: "MacBook Pro - Chrome (macOS)",
      location: "Mumbai, India",
      ip: "103.44.82.11",
      status: "Success",
      active: false
    },
    {
      id: 4,
      time: "Jun 2, 2026, 4:00 PM",
      device: "iPhone 15 - Safari (iOS)",
      location: "Mumbai, India",
      ip: "103.44.82.11",
      status: "Success",
      active: false
    }
  ];

  const handleRequestCredits = () => {
    if (credits >= 100) {
      setToastMessage("You already have maximum free trial credits!");
      setShowToast(true);
      return;
    }
    setCredits((prev) => Math.min(100, prev + 25));
    setToastMessage("Successfully added +25 credits to your account! ⚡");
    setShowToast(true);
  };

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <div className="omma-profile">
      {/* Decorative ambient glowing backlights */}
      <div className="profile-glow-purple" />
      <div className="profile-glow-cyan" />

      {/* Toast Notification */}
      {showToast && (
        <div className="profile-toast glass-panel">
          <span className="toast-icon">⚡</span>
          <p className="toast-text">{toastMessage}</p>
        </div>
      )}

      <div className="profile-container">
        {/* Profile Header Navigation */}
        <header className="profile-header">
          <button className="btn-back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
        </header>

        {/* Main User Card Grid */}
        <div className="profile-grid">
          
          {/* Left Column: User Card & Credits */}
          <div className="profile-left-col">
            
            {/* User Identity Glass Card */}
            <div className="profile-card identity-card glass-panel">
              <div className="avatar-large">
                <span className="avatar-text">
                  {displayName.substring(0, 2).toUpperCase()}
                </span>
                <div className="avatar-ring" />
              </div>
              <div className="identity-details">
                <h1 className="profile-name text-headline-sm">{displayName}</h1>
                <p className="profile-email text-code-label">{userEmail}</p>
              </div>
              <span className="badge-user">DEVELOPER</span>
            </div>

            {/* Credit Usage Glass Card */}
            <div className="profile-card credit-card glass-panel">
              <div className="credit-card-header">
                <h2 className="card-title text-headline-sm">Credits & Usage</h2>
                <span className="plan-badge">FREE TRIAL</span>
              </div>
              <div className="credit-display">
                <span className="credit-amount">{credits}</span>
                <span className="credit-limit">/ 100 credits</span>
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${(credits / 100) * 100}%` }}
                />
              </div>
              <div className="credit-footer">
                <span className="reset-timer text-code-label">Resets in 27 days</span>
                <button 
                  type="button" 
                  className="btn-credits-request" 
                  onClick={handleRequestCredits}
                >
                  Get Free Credits
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-box glass-panel">
                <span className="metric-val">14</span>
                <span className="metric-lbl">3D Scenes</span>
              </div>
              <div className="metric-box glass-panel">
                <span className="metric-val">5</span>
                <span className="metric-lbl">AI Chats</span>
              </div>
              <div className="metric-box glass-panel">
                <span className="metric-val">9</span>
                <span className="metric-lbl">Exports</span>
              </div>
              <div className="metric-box glass-panel">
                <span className="metric-val">2.1k</span>
                <span className="metric-lbl">API Usage</span>
              </div>
            </div>

          </div>

          {/* Right Column: Tabbed Lists (Activity vs Logins) */}
          <div className="profile-right-col">
            <div className="profile-card details-card glass-panel">
              
              {/* Tabs selector */}
              <div className="profile-tabs-header">
                <button 
                  className={`tab-btn ${activeTab === "activity" ? "active" : ""}`}
                  onClick={() => setActiveTab("activity")}
                >
                  Workspace Activity
                </button>
                <button 
                  className={`tab-btn ${activeTab === "logins" ? "active" : ""}`}
                  onClick={() => setActiveTab("logins")}
                >
                  Login Details
                </button>
              </div>

              {/* Tab Content Rendering */}
              <div className="profile-tab-content">
                {activeTab === "activity" ? (
                  
                  /* ACTIVITY TIMELINE LOGS */
                  <div className="activity-timeline">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="timeline-item">
                        <div className="timeline-icon-box">
                          <span className="timeline-icon">{log.icon}</span>
                          <div className="timeline-line" />
                        </div>
                        <div className="timeline-body">
                          <div className="timeline-header">
                            <h3 className="timeline-action">{log.action}</h3>
                            <span className="timeline-time text-code-label">{log.timestamp}</span>
                          </div>
                          <p className="timeline-desc">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                ) : (
                  
                  /* LOGIN DETAILS & HISTORY RECORDS */
                  <div className="login-history-container">
                    <table className="login-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Device & Browser</th>
                          <th>Location</th>
                          <th>IP Address</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loginLogs.map((log) => (
                          <tr key={log.id} className={log.active ? "active-row" : ""}>
                            <td className="time-cell">
                              {log.time}
                              {log.active && <span className="current-badge">Active Session</span>}
                            </td>
                            <td>{log.device}</td>
                            <td>{log.location}</td>
                            <td className="text-code-label">{log.ip}</td>
                            <td>
                              <span className={`status-badge ${log.active ? "active" : "expired"}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
