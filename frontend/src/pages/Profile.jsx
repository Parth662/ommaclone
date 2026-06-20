import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Profile({ userEmail, chatCredits, projectCredits, onCreditsRefilled, onBack }) {
  const [activeTab, setActiveTab] = useState("activity"); // "activity" or "logins"
  const [chatCreditsLocal, setChatCreditsLocal] = useState(chatCredits ?? 500);
  const [projectCreditsLocal, setProjectCreditsLocal] = useState(projectCredits ?? 100);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [displayName, setDisplayName] = useState(userEmail ? userEmail.split("@")[0] : "guest");
  const [activityLogs, setActivityLogs] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const { fullName, email, chatCredits: cc, projectCredits: pc, activityLogs, loginLogs } = response.data.user;
          setDisplayName(fullName || email.split("@")[0]);
          setChatCreditsLocal(cc !== undefined ? cc : 500);
          setProjectCreditsLocal(pc !== undefined ? pc : 100);
          setActivityLogs(activityLogs || []);
          setLoginLogs(loginLogs || []);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userEmail]);

  const handleRequestCredits = async () => {
    if (chatCreditsLocal >= 500 && projectCreditsLocal >= 100) {
      setToastMessage("You already have maximum free trial credits!");
      setShowToast(true);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/user/credits`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setChatCreditsLocal(response.data.chatCredits !== undefined ? response.data.chatCredits : 500);
        setProjectCreditsLocal(response.data.projectCredits !== undefined ? response.data.projectCredits : 100);
        onCreditsRefilled?.();
        setToastMessage("Successfully refilled your credits! ⚡");
        
        // Refresh activity logs by adding the new credit event at the top
        setActivityLogs(prev => [
          {
            _id: Math.random().toString(),
            type: "export",
            action: "Requested Credits",
            details: "Claimed free credit refill (500 chat, 100 project credits)",
            timestamp: "Today, " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            icon: "⚡"
          },
          ...prev
        ]);
      } else {
        setToastMessage("Failed to request credits.");
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to request credits.");
    }
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
            <div className="profile-card credit-card glass-panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="credit-card-header" style={{ marginBottom: 0 }}>
                <h2 className="card-title text-headline-sm">Credits & Usage</h2>
                <span className="plan-badge">FREE TRIAL</span>
              </div>
              
              {/* Chat Credits */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                  <span>💬 Chat Credits</span>
                  <span>{chatCreditsLocal} / 500</span>
                </div>
                <div className="progress-bar-container" style={{ margin: 0, height: 6 }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(chatCreditsLocal / 500) * 100}%`, background: "var(--accent)" }}
                  />
                </div>
              </div>

              {/* Project Credits */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                  <span>⚡ Project Credits</span>
                  <span>{projectCreditsLocal} / 100</span>
                </div>
                <div className="progress-bar-container" style={{ margin: 0, height: 6 }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(projectCreditsLocal / 100) * 100}%`, background: "var(--green)" }}
                  />
                </div>
              </div>

              <div className="credit-footer" style={{ marginTop: 8 }}>
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
                    {activityLogs.map((log, index) => (
                      <div key={log._id || log.id || index} className="timeline-item">
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
                        {loginLogs.map((log, index) => (
                          <tr key={log._id || log.id || index} className={log.active ? "active-row" : ""}>
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
