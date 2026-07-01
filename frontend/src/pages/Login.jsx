import React, { useState, useEffect, useRef } from "react";
import "./Login.css";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Login({ onLoginSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [authStep, setAuthStep] = useState("email"); // "email" or "otp"
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isGoogle, setIsGoogle] = useState(false);
  
  const canvasRef = useRef(null);
  
  // OTP input refs
  const otpRef0 = useRef(null);
  const otpRef1 = useRef(null);
  const otpRef2 = useRef(null);
  const otpRef3 = useRef(null);
  const otpRef4 = useRef(null);
  const otpRef5 = useRef(null);
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3, otpRef4, otpRef5];

  // Simulated authentication steps
  const loadingMessages = [
    "Verifying credentials...",
    "Securing authentication token...",
    "Establishing user workspace..."
  ];

  // Canvas 3D grid and wireframe animation (matching Landing page)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.25;
    let targetRotY = 0.4;
    let rotX = 0.25;
    let rotY = 0.4;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const blocks = [
      { x: 0, z: 0, w: 140, h: 360, d: 140 },
      { x: -280, z: -150, w: 180, h: 220, d: 180 },
      { x: 280, z: 150, w: 160, h: 280, d: 160 },
      { x: -180, z: 350, w: 220, h: 180, d: 220 },
      { x: 180, z: -250, w: 120, h: 140, d: 120 },
      { x: -450, z: 100, w: 100, h: 120, d: 100 },
      { x: 450, z: -100, w: 100, h: 160, d: 100 }
    ];

    const particles = [];
    const particleCount = 60;
    const groundY = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1400,
        y: groundY - Math.random() * 500,
        z: (Math.random() - 0.5) * 1400,
        speed: 0.3 + Math.random() * 0.9,
        size: 1 + Math.random() * 1.5,
        brightness: 0.2 + Math.random() * 0.8
      });
    }

    const cameraDistance = 900;
    const fov = 650;
    const gridSize = 14;
    const gridSpacing = 80;

    const rotate3D = (x, y, z, angleX, angleY) => {
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      return { x: x1, y: y2, z: z2 };
    };

    const render = () => {
      if (!ctx) return;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      targetRotY = mouseX * 0.7;
      targetRotX = 0.25 + mouseY * 0.35;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2 + 80;

      ctx.strokeStyle = "rgba(0, 240, 255, 0.14)";
      ctx.lineWidth = 1;

      for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
        ctx.beginPath();
        let first = true;
        for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
          const px = x * gridSpacing;
          const pz = z * gridSpacing;
          const rotated = rotate3D(px, groundY, pz, rotX, rotY);
          const scale = fov / (rotated.z + cameraDistance);
          if (scale > 0) {
            const sx = rotated.x * scale + centerX;
            const sy = rotated.y * scale + centerY;
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          }
        }
        ctx.stroke();
      }

      for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
        ctx.beginPath();
        let first = true;
        for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
          const px = x * gridSpacing;
          const pz = z * gridSpacing;
          const rotated = rotate3D(px, groundY, pz, rotX, rotY);
          const scale = fov / (rotated.z + cameraDistance);
          if (scale > 0) {
            const sx = rotated.x * scale + centerX;
            const sy = rotated.y * scale + centerY;
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          }
        }
        ctx.stroke();
      }

      blocks.forEach((block) => {
        const x0 = block.x - block.w / 2;
        const x1 = block.x + block.w / 2;
        const y0 = groundY;
        const y1 = groundY - block.h;
        const z0 = block.z - block.d / 2;
        const z1 = block.z + block.d / 2;

        const vertices = [
          { x: x0, y: y0, z: z0 },
          { x: x1, y: y0, z: z0 },
          { x: x1, y: y1, z: z0 },
          { x: x0, y: y1, z: z0 },
          { x: x0, y: y0, z: z1 },
          { x: x1, y: y0, z: z1 },
          { x: x1, y: y1, z: z1 },
          { x: x0, y: y1, z: z1 }
        ];

        const projected = vertices.map((v) => {
          const rotated = rotate3D(v.x, v.y, v.z, rotX, rotY);
          const scale = fov / (rotated.z + cameraDistance);
          return {
            x: rotated.x * scale + centerX,
            y: rotated.y * scale + centerY,
            z: rotated.z,
            visible: scale > 0
          };
        });

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        ctx.lineWidth = 1;
        edges.forEach(([pA, pB]) => {
          const vA = projected[pA];
          const vB = projected[pB];
          if (vA.visible && vB.visible) {
            const avgZ = (vA.z + vB.z) / 2;
            const alpha = Math.max(0.01, 1 - (avgZ + 500) / 1600);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(vA.x, vA.y);
            ctx.lineTo(vB.x, vB.y);
            ctx.stroke();
          }
        });

        const topFace = [3, 2, 6, 7];
        if (topFace.every((idx) => projected[idx].visible)) {
          const avgZ = topFace.reduce((sum, idx) => sum + projected[idx].z, 0) / 4;
          const alpha = Math.max(0.01, 1 - (avgZ + 500) / 1600);

          ctx.fillStyle = `rgba(188, 0, 255, ${alpha * 0.05})`;
          ctx.beginPath();
          ctx.moveTo(projected[topFace[0]].x, projected[topFace[0]].y);
          for (let i = 1; i < topFace.length; i++) {
            ctx.lineTo(projected[topFace[i]].x, projected[topFace[i]].y);
          }
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = `rgba(188, 0, 255, ${alpha * 0.32})`;
          ctx.beginPath();
          ctx.moveTo(projected[topFace[0]].x, projected[topFace[0]].y);
          for (let i = 1; i < topFace.length; i++) {
            ctx.lineTo(projected[topFace[i]].x, projected[topFace[i]].y);
          }
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

        const rotated = rotate3D(p.x, p.y, p.z, rotX, rotY);
        const scale = fov / (rotated.z + cameraDistance);
        if (scale > 0) {
          const sx = rotated.x * scale + centerX;
          const sy = rotated.y * scale + centerY;
          const size = p.size * scale;
          const alpha = Math.max(0.01, 1 - (rotated.z + 500) / 1600) * p.brightness;

          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.65})`;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
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

  useEffect(() => {
    if (!isLoading) return;
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            const finalEmail = localStorage.getItem("userEmail") || email || "guest@omma.build";
            onLoginSuccess(finalEmail);
          }, 300);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(stepInterval);
  }, [isLoading, onLoginSuccess, email, isGoogle]);

  useEffect(() => {
    if (authStep !== "otp") return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, authStep]);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, { email: email.trim() });
      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Failed to send OTP.");
      }

      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setCanResend(false);
      setSuccessMessage("Verification code sent successfully!");
      setAuthStep("otp");
      
      setTimeout(() => {
        otpRef0.current?.focus();
      }, 100);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to send verification code. Try again.";
      setError(errMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.some(digit => digit === "")) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    const otpCode = otp.join("");
    setIsSendingOtp(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email: email.trim(), otp: otpCode });
      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Verification failed.");
      }

      // Store credentials in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);

      // Start standard animated workspace setup loading sequence
      setIsLoading(true);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Invalid or expired verification code.";
      setError(errMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccessMessage("");
    setIsSendingOtp(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, { email: email.trim() });
      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Failed to resend OTP.");
      }

      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setCanResend(false);
      setSuccessMessage("A new verification code has been sent.");
      otpRef0.current?.focus();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to resend. Please try again.";
      setError(errMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (value && isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpRefs[index - 1].current?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && !isNaN(pasteData)) {
      const pasteArray = pasteData.split("");
      setOtp(pasteArray);
      otpRefs[5].current?.focus();
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsSendingOtp(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Retrieve the Firebase ID Token
      const idToken = await result.user.getIdToken();

      // Exchange the Firebase ID token for our backend application JWT session
      const response = await axios.post(`${API_BASE_URL}/google-login`, { idToken });
      const data = response.data;
      if (!data.success) {
        throw new Error(data.message || "Failed to authenticate with backend.");
      }

      setIsGoogle(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email);

      // Trigger standard workspace setup animated loader
      setIsLoading(true);
    } catch (err) {
      console.error("Google Auth Error:", err);
      const errMsg = err.response?.data?.message || err.message || "Google Authentication failed. Please try again.";
      setError(errMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleBackAction = () => {
    if (authStep === "otp") {
      setAuthStep("email");
      setError("");
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="omma-login">
      <canvas ref={canvasRef} className="login-bg-canvas" />

      <div className="login-glow-purple" />
      <div className="login-glow-cyan" />

      <div className="login-card-container">
        {onBack && !isLoading && (
          <button type="button" className="btn-back-home" onClick={handleBackAction}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {authStep === "otp" ? "Back to email" : "Back to home"}
          </button>
        )}

        <div className="login-card-glow-purple" />
        <div className="login-card-glow-cyan" />

        <div className="login-card glass-panel">
          {isLoading ? (
            <div className="login-loading-view">
              <div className="auth-spinner">
                <div className="spinner-outer" />
                <div className="spinner-inner" />
                <span className="spinner-icon">⚡</span>
              </div>
              <div className="loading-status-container">
                <p className="loading-status text-headline-sm">{loadingMessages[loadingStep]}</p>
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
              {authStep === "email" ? (
                <>
                  <div className="login-brand">
                    <span className="brand-logo-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </span>
                    <h1 className="brand-title">OMMA</h1>
                    <p className="brand-subtitle">The AI-powered creative studio for interactive 3D.</p>
                  </div>

                  <form className="login-form" onSubmit={handleSubmitEmail}>
                    <div className="input-group">
                      <label htmlFor="email" className="text-code-label">Email Address</label>
                      <input
                        type="text"
                        id="email"
                        className={`login-input ${error ? "input-error" : ""}`}
                        placeholder="name@domain.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        autoComplete="email"
                        aria-invalid={!!error}
                      />
                      {error && <p className="input-error-msg">{error}</p>}
                    </div>

                    <button type="submit" className="btn-login-submit text-headline-sm" disabled={isSendingOtp}>
                      {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </form>

                  <div className="auth-divider">
                    <span className="divider-line" />
                    <span className="divider-text text-code-label">or continue with</span>
                    <span className="divider-line" />
                  </div>

                  <button 
                    type="button" 
                    className="btn-google-login text-headline-sm" 
                    onClick={handleGoogleLogin}
                  >
                    <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    Login by Google
                  </button>

                </>
              ) : (
                <>
                  <div className="login-brand">
                    <span className="brand-logo-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 6l-10 7L2 6" />
                      </svg>
                    </span>
                    <h1 className="brand-title">Verify Code</h1>
                    <p className="brand-subtitle">
                      We sent a 6-digit code to <strong style={{ color: "var(--neon-cyan)" }}>{email}</strong>.
                    </p>
                  </div>

                  <form className="login-form" onSubmit={handleSubmitOtp}>
                    <div className="otp-container">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={otpRefs[idx]}
                          type="text"
                          maxLength={1}
                          pattern="[0-9]*"
                          inputMode="numeric"
                          className="otp-input"
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, idx)}
                          onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                          onPaste={handleOtpPaste}
                          aria-label={`Digit ${idx + 1}`}
                        />
                      ))}
                    </div>

                    {successMessage && <p className="success-msg text-center">{successMessage}</p>}
                    {error && <p className="input-error-msg text-center">{error}</p>}

                    <button type="submit" className="btn-login-submit text-headline-sm" disabled={isSendingOtp}>
                      {isSendingOtp ? "Verifying..." : "Verify OTP"}
                    </button>
                  </form>

                  <div className="resend-container text-code-label">
                    {canResend ? (
                      <span className="resend-link" onClick={handleResendCode}>
                        Resend Code
                      </span>
                    ) : (
                      <span className="resend-timer">
                        Resend code in {countdown}s
                      </span>
                    )}
                  </div>

                  <div className="change-email-container">
                    <span className="change-email-btn text-code-label" onClick={() => { setAuthStep("email"); setError(""); }}>
                      ← Change Email
                    </span>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}