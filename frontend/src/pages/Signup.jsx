import React, { useState, useEffect, useRef } from "react";
import "./Signup.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Signup({ onSignupSuccess, onNavigateLogin, onBack }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canvasRef = useRef(null);

  const loadingMessages = [
    "Creating your account...",
    "Securing your credentials...",
    "Setting up your workspace...",
  ];

  // ── Identical 3D canvas background as Login ──────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let mouseX = 0, mouseY = 0;
    let targetRotX = 0.25, targetRotY = 0.4;
    let rotX = 0.25, rotY = 0.4;

    const handleMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const blocks = [
      { x: 0,    z: 0,    w: 140, h: 360, d: 140 },
      { x: -280, z: -150, w: 180, h: 220, d: 180 },
      { x: 280,  z: 150,  w: 160, h: 280, d: 160 },
      { x: -180, z: 350,  w: 220, h: 180, d: 220 },
      { x: 180,  z: -250, w: 120, h: 140, d: 120 },
      { x: -450, z: 100,  w: 100, h: 120, d: 100 },
      { x: 450,  z: -100, w: 100, h: 160, d: 100 },
    ];

    const particles = [];
    const groundY = 150;
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1400,
        y: groundY - Math.random() * 500,
        z: (Math.random() - 0.5) * 1400,
        speed: 0.3 + Math.random() * 0.9,
        size: 1 + Math.random() * 1.5,
        brightness: 0.2 + Math.random() * 0.8,
      });
    }

    const fov = 650, cameraDistance = 900;
    const gridSize = 14, gridSpacing = 80;

    const rotate3D = (x, y, z, aX, aY) => {
      const cosY = Math.cos(aY), sinY = Math.sin(aY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const cosX = Math.cos(aX), sinX = Math.sin(aX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      return { x: x1, y: y2, z: z2 };
    };

    const render = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      targetRotY = mouseX * 0.7;
      targetRotX = 0.25 + mouseY * 0.35;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const cx = width / 2, cy = height / 2 + 80;

      ctx.strokeStyle = "rgba(0, 240, 255, 0.14)";
      ctx.lineWidth = 1;

      for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
        ctx.beginPath();
        let first = true;
        for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
          const r = rotate3D(x * gridSpacing, groundY, z * gridSpacing, rotX, rotY);
          const s = fov / (r.z + cameraDistance);
          if (s > 0) {
            first ? ctx.moveTo(r.x * s + cx, r.y * s + cy) : ctx.lineTo(r.x * s + cx, r.y * s + cy);
            first = false;
          }
        }
        ctx.stroke();
      }

      for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
        ctx.beginPath();
        let first = true;
        for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
          const r = rotate3D(x * gridSpacing, groundY, z * gridSpacing, rotX, rotY);
          const s = fov / (r.z + cameraDistance);
          if (s > 0) {
            first ? ctx.moveTo(r.x * s + cx, r.y * s + cy) : ctx.lineTo(r.x * s + cx, r.y * s + cy);
            first = false;
          }
        }
        ctx.stroke();
      }

      blocks.forEach((block) => {
        const x0 = block.x - block.w / 2, x1 = block.x + block.w / 2;
        const y0 = groundY, y1 = groundY - block.h;
        const z0 = block.z - block.d / 2, z1 = block.z + block.d / 2;

        const verts = [
          { x: x0, y: y0, z: z0 }, { x: x1, y: y0, z: z0 },
          { x: x1, y: y1, z: z0 }, { x: x0, y: y1, z: z0 },
          { x: x0, y: y0, z: z1 }, { x: x1, y: y0, z: z1 },
          { x: x1, y: y1, z: z1 }, { x: x0, y: y1, z: z1 },
        ];

        const proj = verts.map((v) => {
          const r = rotate3D(v.x, v.y, v.z, rotX, rotY);
          const s = fov / (r.z + cameraDistance);
          return { x: r.x * s + cx, y: r.y * s + cy, z: r.z, visible: s > 0 };
        });

        const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        ctx.lineWidth = 1;
        edges.forEach(([a, b]) => {
          if (proj[a].visible && proj[b].visible) {
            const alpha = Math.max(0.01, 1 - ((proj[a].z + proj[b].z) / 2 + 500) / 1600);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(proj[a].x, proj[a].y);
            ctx.lineTo(proj[b].x, proj[b].y);
            ctx.stroke();
          }
        });

        const top = [3, 2, 6, 7];
        if (top.every((i) => proj[i].visible)) {
          const avgZ = top.reduce((s, i) => s + proj[i].z, 0) / 4;
          const alpha = Math.max(0.01, 1 - (avgZ + 500) / 1600);
          ctx.fillStyle = `rgba(188, 0, 255, ${alpha * 0.05})`;
          ctx.beginPath();
          ctx.moveTo(proj[top[0]].x, proj[top[0]].y);
          top.slice(1).forEach((i) => ctx.lineTo(proj[i].x, proj[i].y));
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `rgba(188, 0, 255, ${alpha * 0.32})`;
          ctx.beginPath();
          ctx.moveTo(proj[top[0]].x, proj[top[0]].y);
          top.slice(1).forEach((i) => ctx.lineTo(proj[i].x, proj[i].y));
          ctx.closePath();
          ctx.stroke();
        }
      });

      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < groundY - 500) {
          p.y = groundY;
          p.x = (Math.random() - 0.5) * 1400;
          p.z = (Math.random() - 0.5) * 1400;
        }
        const r = rotate3D(p.x, p.y, p.z, rotX, rotY);
        const s = fov / (r.z + cameraDistance);
        if (s > 0) {
          const alpha = Math.max(0.01, 1 - (r.z + 500) / 1600) * p.brightness;
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.65})`;
          ctx.beginPath();
          ctx.arc(r.x * s + cx, r.y * s + cy, p.size * s, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ── Loading sequencer ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            if (onSignupSuccess) onSignupSuccess(email);
          }, 300);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isLoading]);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    else if (fullName.trim().length < 2) e.fullName = "Name must be at least 2 characters.";
    if (!email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        fullName: fullName.trim(),
        email: email.trim(),
        password: password
      });
      const data = response.data;
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email);
      } else {
        setErrors({ submit: data.message || "Failed to create account." });
        setIsLoading(false);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to create account. Try again.";
      setErrors({ submit: errMsg });
      setIsLoading(false);
    }
  };

  const handleBackAction = () => {
    if (onBack) onBack();
  };

  return (
    <div className="omma-signup">
      <canvas ref={canvasRef} className="signup-bg-canvas" />
      <div className="signup-glow-purple" />
      <div className="signup-glow-cyan" />

      <div className="signup-card-container">
        {onBack && !isLoading && (
          <button type="button" className="btn-back-home" onClick={handleBackAction}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to home
          </button>
        )}

        <div className="signup-card-glow-purple" />
        <div className="signup-card-glow-cyan" />

        <div className="signup-card">
          {isLoading ? (
            <div className="signup-loading-view">
              <div className="auth-spinner">
                <div className="spinner-outer" />
                <div className="spinner-inner" />
                <span className="spinner-icon">⚡</span>
              </div>
              <div className="loading-status-container">
                <p className="loading-status">{loadingMessages[loadingStep]}</p>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Brand */}
              <div className="signup-brand">
                <span className="brand-logo-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </span>
                <h1 className="brand-title">OMMA</h1>
                <p className="brand-subtitle">Create your account to get started.</p>
              </div>

              {/* Form */}
              <form className="signup-form" onSubmit={handleSubmit} noValidate>
                {errors.submit && <p className="input-error-msg text-center" style={{ marginBottom: 15, width: "100%", color: "#f06a6a" }}>{errors.submit}</p>}
                {/* Full Name */}
                <div className="input-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    className={`signup-input ${errors.fullName ? "input-error" : ""}`}
                    placeholder="Jane Smith"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" })); }}
                    autoComplete="name"
                  />
                  {errors.fullName && <p className="input-error-msg">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="input-group">
                  <label htmlFor="signupEmail">Email Address</label>
                  <input
                    type="email"
                    id="signupEmail"
                    className={`signup-input ${errors.email ? "input-error" : ""}`}
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
                    autoComplete="email"
                  />
                  {errors.email && <p className="input-error-msg">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="input-group">
                  <label htmlFor="signupPassword">Password</label>
                  <div className="input-password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="signupPassword"
                      className={`signup-input ${errors.password ? "input-error" : ""}`}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: "" })); }}
                      autoComplete="new-password"
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="input-error-msg">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-password-wrapper">
                    <input
                      type={showConfirm ? "text" : "password"}
                      id="confirmPassword"
                      className={`signup-input ${errors.confirmPassword ? "input-error" : ""}`}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                      autoComplete="new-password"
                    />
                    <button type="button" className="toggle-password" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1}>
                      {showConfirm ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="input-error-msg">{errors.confirmPassword}</p>}
                </div>

                <button type="submit" className="btn-signup-submit">
                  Create Account
                </button>
              </form>

              {/* Divider */}
              <div className="auth-divider">
                <span className="divider-line" />
                <span className="divider-text">or continue with</span>
                <span className="divider-line" />
              </div>

              {/* Google — no Firebase, just triggers loading like Login does */}
              <button type="button" className="btn-google-signup" onClick={() => setIsLoading(true)}>
                <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>

              {/* Login link */}
              <p className="login-redirect">
                Already have an account?{" "}
                <span
                  className="login-redirect-link"
                  onClick={() => onNavigateLogin && onNavigateLogin()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && onNavigateLogin && onNavigateLogin()}
                >
                  Log in
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}