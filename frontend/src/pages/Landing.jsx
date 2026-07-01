import React, { useState, useEffect, useRef } from "react";
import "./Landing.css";

export default function Landing({ onBack, onNavigate, onGetStarted }) {
  const [shrinkHeader, setShrinkHeader] = useState(false);
  const [promptValue, setPromptValue] = useState("");
  const canvasRef = useRef(null);

  const [showPricing, setShowPricing] = useState(false);
  const [pricingTab, setPricingTab] = useState("subs"); // "subs" or "credits"
  const [showEnterprise, setShowEnterprise] = useState(false);
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  const handleEnterpriseSubmit = (e) => {
    e.preventDefault();
    setEnterpriseSubmitted(true);
  };

  const handleLogin = () => {
    if (onBack) onBack();
  };

  const handleGetStarted = () => {
    if (onGetStarted) onGetStarted();
    else if (onBack) onBack();
  };

  // Shrink header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShrinkHeader(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // High-performance interactive 3D grid and wireframe animation
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.25;
    let targetRotY = 0.4;
    let rotX = 0.25;
    let rotY = 0.4;

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
    const particleCount = 60;
    const groundY = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1400,
        y: groundY - Math.random() * 500,
        z: (Math.random() - 0.5) * 1400,
        speed: 0.3 + Math.random() * 0.9,
        size: 1 + Math.random() * 1.5,
        brightness: 0.2 + Math.random() * 0.8,
      });
    }

    const cameraDistance = 900;
    const fov = 650;
    const gridSize = 14;
    const gridSpacing = 80;

    const rotate3D = (x, y, z, angleX, angleY) => {
      const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      return { x: x1, y: y2, z: z2 };
    };

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      targetRotY = mouseX * 0.7;
      targetRotX = 0.25 + mouseY * 0.35;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const centerX = width / 2;
      const centerY = height / 2 + 80;

      ctx.strokeStyle = "rgba(0, 240, 255, 0.18)";
      ctx.lineWidth = 1;

      for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
        ctx.beginPath();
        let first = true;
        for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
          const rotated = rotate3D(x * gridSpacing, groundY, z * gridSpacing, rotX, rotY);
          const scale = fov / (rotated.z + cameraDistance);
          if (scale > 0) {
            const sx = rotated.x * scale + centerX;
            const sy = rotated.y * scale + centerY;
            first ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
            first = false;
          }
        }
        ctx.stroke();
      }

      for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
        ctx.beginPath();
        let first = true;
        for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
          const rotated = rotate3D(x * gridSpacing, groundY, z * gridSpacing, rotX, rotY);
          const scale = fov / (rotated.z + cameraDistance);
          if (scale > 0) {
            const sx = rotated.x * scale + centerX;
            const sy = rotated.y * scale + centerY;
            first ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
            first = false;
          }
        }
        ctx.stroke();
      }

      blocks.forEach((block) => {
        const x0 = block.x - block.w / 2, x1 = block.x + block.w / 2;
        const y0 = groundY, y1 = groundY - block.h;
        const z0 = block.z - block.d / 2, z1 = block.z + block.d / 2;

        const vertices = [
          { x: x0, y: y0, z: z0 }, { x: x1, y: y0, z: z0 },
          { x: x1, y: y1, z: z0 }, { x: x0, y: y1, z: z0 },
          { x: x0, y: y0, z: z1 }, { x: x1, y: y0, z: z1 },
          { x: x1, y: y1, z: z1 }, { x: x0, y: y1, z: z1 },
        ];

        const projected = vertices.map((v) => {
          const rotated = rotate3D(v.x, v.y, v.z, rotX, rotY);
          const scale = fov / (rotated.z + cameraDistance);
          return {
            x: rotated.x * scale + centerX,
            y: rotated.y * scale + centerY,
            z: rotated.z,
            visible: scale > 0,
          };
        });

        const edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7],
        ];

        ctx.lineWidth = 1;
        edges.forEach(([pA, pB]) => {
          const vA = projected[pA], vB = projected[pB];
          if (vA.visible && vB.visible) {
            const alpha = Math.max(0.01, 1 - ((vA.z + vB.z) / 2 + 500) / 1600);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.35})`;
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
          ctx.fillStyle = `rgba(188, 0, 255, ${alpha * 0.08})`;
          ctx.beginPath();
          ctx.moveTo(projected[topFace[0]].x, projected[topFace[0]].y);
          for (let i = 1; i < topFace.length; i++) {
            ctx.lineTo(projected[topFace[i]].x, projected[topFace[i]].y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `rgba(188, 0, 255, ${alpha * 0.5})`;
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
          const alpha = Math.max(0.01, 1 - (rotated.z + 500) / 1600) * p.brightness;
          ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(sx, sy, p.size * scale, 0, Math.PI * 2);
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

  return (
    <div className="omma-landing">
      {/* Fixed Header */}
      <header className={`omma-header ${shrinkHeader ? "shrink" : ""}`}>
        <div className="header-container">
          <div className="header-left">
            <span
              className="brand-name"
              onClick={handleGetStarted}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleGetStarted()}
            >
              OMMA
            </span>
            <nav className="nav-menu" aria-label="Main Navigation">
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); setShowPricing(true); }}>Pricing</a>
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); setShowEnterprise(true); setEnterpriseSubmitted(false); }}>Enterprise</a>
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); setShowChangelog(true); }}>Changelog</a>
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate("docs") : handleGetStarted(); }}>Docs</a>
            </nav>
          </div>
          <div className="header-right">
            {/* Login → goes to Login page */}
            <button type="button" className="btn-login" onClick={handleLogin}>Login</button>
            {/* Get Started → goes to Signup page */}
            <button type="button" className="btn-primary" onClick={handleGetStarted}>Get Started</button>
          </div>
        </div>
      </header>

      <main className="omma-main">
        {/* Hero Section */}
        <section className="omma-hero grid-bg">
          <canvas ref={canvasRef} className="hero-3d-canvas" />
          <div className="hero-atmosphere" />
          <div className="glow-sphere-purple" />
          <div className="glow-sphere-cyan" />

          <div className="hero-content">
            <div className="badge-container glass-panel">
              <span className="badge-dot">
                <span className="badge-dot-ping" />
              </span>
              <span className="badge-text text-code-label">V2.0 ALPHA NOW LIVE</span>
            </div>

            <h1 className="hero-title-text text-display-lg">
              Describe it. <br />
              <span className="gradient-text">Omma builds it.</span>
            </h1>

            <p className="hero-subtitle-text text-body-md">
              The world's first AI architectural engine. Transform natural language prompts into immersive 3D scenes, production-ready websites, and dynamic applications in seconds.
            </p>

            <div className="prompt-row">
              <div className="prompt-wrapper-mobile">
                <input
                  type="text"
                  className="input-prompt"
                  placeholder="A futuristic cyberpunk laboratory with neon rain..."
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGetStarted()}
                  aria-label="Scene prompt input"
                />
              </div>
              <button type="button" className="btn-generate text-headline-sm" onClick={handleGetStarted}>
                Generate Scene
              </button>
            </div>
          </div>
        </section>

        {/* Capabilities Bento Grid */}
        <section className="omma-section">
          <div className="section-title">
            <span className="section-eyebrow text-code-label">CAPABILITIES</span>
            <h2 className="text-headline-lg">
              Beyond text-to-image. <br />
              <span>Text-to-Everything.</span>
            </h2>
          </div>

          <div className="bento-grid">
            <div className="bento-card col-span-8 glass-panel neon-glow-cyan">
              <div className="card-top">
                <div className="card-icon-wrapper glass-panel cyan-icon">
                  <span className="material-symbols-outlined">web</span>
                </div>
                <h3 className="text-headline-lg card-title">Websites</h3>
                <p className="text-body-md card-description">
                  Generate high-performance, responsive React components and layouts. SEO-optimized and ready to deploy.
                </p>
              </div>
              <div className="websites-visual">
                <div className="mock-browser glass-panel">
                  <div className="browser-header">
                    <div className="browser-dots">
                      <span className="dot dot-red"></span>
                      <span className="dot dot-yellow"></span>
                      <span className="dot dot-green"></span>
                    </div>
                    <div className="browser-address">omma.build/studio</div>
                  </div>
                  <div className="browser-content">
                    <div className="mock-nav">
                      <div className="mock-logo">▲ OMMA</div>
                      <div className="mock-nav-links">
                        <span className="nav-dot"></span>
                        <span className="nav-dot"></span>
                        <span className="nav-dot"></span>
                      </div>
                    </div>
                    <div className="mock-hero">
                      <div className="mock-title">Interactive 3D Art</div>
                      <div className="mock-subtitle">Generated in seconds by Forge AI.</div>
                      <div className="mock-cta">Get Started</div>
                    </div>
                    <div className="mock-grid">
                      <div className="mock-grid-card">
                        <div className="mock-card-icon">⚡</div>
                        <div className="mock-card-title">Assets</div>
                      </div>
                      <div className="mock-grid-card">
                        <div className="mock-card-icon">🌀</div>
                        <div className="mock-card-title">Shaders</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bento-card col-span-4 scenes-card">
              <div className="card-top">
                <div className="card-icon-wrapper glass-panel purple-icon">
                  <span className="material-symbols-outlined">view_in_ar</span>
                </div>
                <h3 className="text-headline-sm card-title">3D Scenes</h3>
                <p className="text-body-sm card-description">
                  Volumetric rendering for Three.js and Unreal Engine 5.
                </p>
              </div>
              <div className="scenes-visual">
                <img
                  alt="3D Cyberpunk Holographic Character Preview"
                  src="/cyberpunk_3d_character.png"
                />
              </div>
            </div>

            <div className="bento-card col-span-4 glass-panel apps-card">
              <div className="card-top">
                <div className="card-icon-wrapper glass-panel cyan-icon">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <h3 className="text-headline-sm card-title">Apps</h3>
                <p className="text-body-sm card-description">
                  Full-stack logic and database schemas orchestrated by Omma's core agents.
                </p>
              </div>
              <div className="apps-visual">
                <img
                  alt="Robotic Application Relation Preview"
                  src="/robotic_app_relation.png"
                />
              </div>
            </div>

            <div className="bento-card col-span-8 data-card">
              <div className="data-copy">
                <h3 className="text-headline-lg card-title">Precision Data</h3>
                <p className="text-body-md card-description">
                  Connect your own datasets to guide the AI with factual context and real-world parameters.
                </p>
              </div>
              <div className="data-terminal text-code-label">
                <div className="term-line cyan-text">IMPORT data.csv</div>
                <div className="term-line muted-text">PARSING HEADERS...</div>
                <div className="term-line glowing-bg">MAPPING TO 3D COORDINATES</div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Pipeline Section */}
        <section className="omma-section">
          <div className="pipeline-grid">
            <div className="pipeline-info">
              <span className="section-eyebrow pipeline-eyebrow text-code-label">INTEGRATION</span>
              <h2 className="text-display-lg section-title">
                Create with real data, <br />
                <span>in real-time</span>
              </h2>
              <p className="text-body-md card-description">
                Omma doesn't just hallucinate visuals; it builds environments based on your specific business data. Connect CSV, JSON, and complex CAD files directly into the generation pipeline.
              </p>
              <ul className="benefits-list">
                <li className="benefit-item">
                  <span className="material-symbols-outlined check-icon">check_circle</span>
                  <span className="text-body-md">Dynamic CSV Property Mapping</span>
                </li>
                <li className="benefit-item">
                  <span className="material-symbols-outlined check-icon">check_circle</span>
                  <span className="text-body-md">Real-time JSON Webhooks</span>
                </li>
                <li className="benefit-item">
                  <span className="material-symbols-outlined check-icon">check_circle</span>
                  <span className="text-body-md">High-fidelity OBJ/GLTF Export</span>
                </li>
              </ul>
            </div>

            <div className="pipeline-inspector">
              <div className="inspector-header">
                <div className="window-dots">
                  <span className="win-dot dot-red" />
                  <span className="win-dot dot-yellow" />
                  <span className="win-dot dot-green" />
                </div>
                <span className="inspector-title text-code-label">Pipeline Inspector</span>
              </div>
              <div className="inspector-body">
                <div className="connection-card">
                  <div className="file-details">
                    <span className="material-symbols-outlined file-icon">description</span>
                    <span className="text-code-label">sales_data_2024.csv</span>
                  </div>
                  <span className="connection-status text-code-label">CONNECTED</span>
                </div>
                <div className="progress-panel">
                  <div className="progress-meta">
                    <span className="progress-label text-code-label">PROCESSING MESH...</span>
                    <span className="progress-percent text-code-label">88%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" />
                  </div>
                </div>
                <div className="stats-grid">
                  <div className="stat-pill glass-panel">
                    <span className="pill-label">VERTICES</span>
                    <span className="pill-value cyan-text text-code-label">1,204,492</span>
                  </div>
                  <div className="stat-pill glass-panel">
                    <span className="pill-label">LATENCY</span>
                    <span className="pill-value purple-text text-code-label">12ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agents Section */}
        <section className="omma-section omma-agents-section">
          <div className="section-title text-center">
            <span className="section-eyebrow text-code-label text-center">PARALLEL INTELLIGENCE</span>
            <h2 className="text-display-lg">Parallel Intelligence</h2>
            <p className="text-body-md card-description">
              Run multiple AI agents simultaneously to handle geometry, physics, and lighting in parallel.
            </p>
          </div>
          <div className="agents-grid">
            <div className="agent-card glass-panel card-border-cyan">
              <div className="agent-header">
                <span className="agent-name cyan-text text-code-label">AGENT_ALPHA</span>
                <span className="agent-badge cyan-badge">ACTIVE</span>
              </div>
              <h4 className="text-headline-sm agent-title">Structural Logic</h4>
              <p className="text-body-sm agent-description">Handles architectural integrity and spatial layout constraints.</p>
              <div className="eq-container" aria-hidden="true">
                <span className="eq-bar bg-cyan eq-anim-1" />
                <span className="eq-bar bg-cyan eq-anim-2" />
                <span className="eq-bar bg-cyan eq-anim-3" />
              </div>
            </div>
            <div className="agent-card glass-panel card-border-purple">
              <div className="agent-header">
                <span className="agent-name purple-text text-code-label">AGENT_BETA</span>
                <span className="agent-badge purple-badge">THINKING</span>
              </div>
              <h4 className="text-headline-sm agent-title">PBR Materialist</h4>
              <p className="text-body-sm agent-description">Generates ultra-realistic textures and light-reactive surfaces.</p>
              <div className="eq-container" aria-hidden="true">
                <span className="eq-bar bg-purple eq-anim-3" />
                <span className="eq-bar bg-purple eq-anim-1" />
                <span className="eq-bar bg-purple eq-anim-2" />
              </div>
            </div>
            <div className="agent-card glass-panel card-border-white">
              <div className="agent-header">
                <span className="agent-name white-text text-code-label">AGENT_GAMMA</span>
                <span className="agent-badge white-badge">STANDBY</span>
              </div>
              <h4 className="text-headline-sm agent-title">Physics Solver</h4>
              <p className="text-body-sm agent-description">Simulates real-world gravity, collision, and fluid dynamics.</p>
              <div className="eq-container" aria-hidden="true">
                <span className="eq-bar bg-white eq-static-1" />
                <span className="eq-bar bg-white eq-static-2" />
                <span className="eq-bar bg-white eq-static-3" />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="omma-section">
          <div className="cta-box glass-panel neon-glow-purple">
            <div className="cta-glow-cyan" />
            <div className="cta-glow-purple" />
            <h2 className="text-display-lg cta-title">Ready to build something extraordinary?</h2>
            <p className="text-body-md cta-description">
              Join 10,000+ creators building the next generation of the spatial web with Omma.
            </p>
            <div className="cta-buttons">
              <button type="button" className="btn-primary btn-cta-primary" onClick={handleGetStarted}>
                Get Instant Access
              </button>
              <button type="button" className="btn-primary btn-cta-secondary glass-panel" style={{ color: "var(--primary)" }} onClick={handleGetStarted}>
                View Gallery
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="omma-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-brand-title">OMMA</span>
            <span className="footer-copyright text-body-sm">© 2024 OMMA Build. All rights reserved.</span>
          </div>
          <nav className="footer-links" aria-label="Secondary Navigation">
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Terms</a>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Twitter</a>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>Discord</a>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>GitHub</a>
          </nav>
        </div>
      </footer>

      {showPricing && (
        <div className="landing-modal-overlay" onClick={() => setShowPricing(false)}>
          <div className="landing-modal-box glass-panel neon-glow-cyan" onClick={(e) => e.stopPropagation()}>
            <div className="landing-modal-header">
              <div>
                <h3 className="landing-modal-title gradient-text-cyan">Pricing Plans</h3>
                <p className="landing-modal-subtitle">Choose the perfect tier for your creation process</p>
              </div>
              <button className="landing-modal-close" onClick={() => setShowPricing(false)}>✕</button>
            </div>
            
            <div className="pricing-tabs">
              <button 
                className={`pricing-tab ${pricingTab === "subs" ? "active" : ""}`}
                onClick={() => setPricingTab("subs")}
              >
                Subscription Plans
              </button>
              <button 
                className={`pricing-tab ${pricingTab === "credits" ? "active" : ""}`}
                onClick={() => setPricingTab("credits")}
              >
                Credit Packs
              </button>
            </div>

            {pricingTab === "subs" ? (
              <div className="landing-pricing-grid">
                <div className="landing-price-card">
                  <div className="price-card-header">
                    <span className="plan-name">Free</span>
                    <div className="plan-price">$0<span className="period">/mo</span></div>
                    <p className="plan-desc">Get started with the basics of spatial engine design</p>
                  </div>
                  <ul className="plan-features">
                    <li>✓ 50 credits / month</li>
                    <li>✓ Basic 3D models</li>
                    <li>✓ Code generation</li>
                    <li>✓ Community access</li>
                  </ul>
                  <button className="btn-plan btn-secondary" onClick={() => { setShowPricing(false); handleLogin(); }}>Get Started</button>
                </div>
                
                <div className="landing-price-card highlighted">
                  <div className="price-badge">POPULAR</div>
                  <div className="price-card-header">
                    <span className="plan-name">Pro</span>
                    <div className="plan-price">$39<span className="period">/mo</span></div>
                    <p className="plan-desc">For professional creators and spatial developers</p>
                  </div>
                  <ul className="plan-features">
                    <li>✓ 2,000 credits / month</li>
                    <li>✓ Everything in Free</li>
                    <li>✓ Premium 3D model generation</li>
                    <li>✓ Image generation</li>
                    <li>✓ Custom domains</li>
                  </ul>
                  <button className="btn-plan btn-primary" onClick={() => { setShowPricing(false); handleLogin(); }}>Upgrade to Pro</button>
                </div>

                <div className="landing-price-card">
                  <div className="price-card-header">
                    <span className="plan-name">Max</span>
                    <div className="plan-price">$129<span className="period">/seat/mo</span></div>
                    <p className="plan-desc">For professional teams scaling spatial intelligence</p>
                  </div>
                  <ul className="plan-features">
                    <li>✓ 7,000 credits / seat / month</li>
                    <li>✓ Everything in Pro</li>
                    <li>✓ Team collaboration spaces</li>
                    <li>✓ Shared credit pools</li>
                  </ul>
                  <button className="btn-plan btn-secondary" onClick={() => { setShowPricing(false); handleLogin(); }}>Upgrade to Max</button>
                </div>
              </div>
            ) : (
              <div className="landing-credits-grid">
                <div className="landing-credit-card">
                  <div className="credit-header">
                    <span className="credit-amount">500 credits</span>
                    <div className="credit-price">$5</div>
                  </div>
                  <p className="credit-desc">Perfect for occasional experiments and small projects.</p>
                  <button className="btn-plan btn-secondary" onClick={() => { setShowPricing(false); handleLogin(); }}>Buy Pack</button>
                </div>
                <div className="landing-credit-card highlighted">
                  <div className="price-badge">POPULAR</div>
                  <div className="credit-header">
                    <span className="credit-amount">2,000 credits</span>
                    <div className="credit-price">$15</div>
                  </div>
                  <p className="credit-desc">Best value for expanding design ideas and rapid iterations.</p>
                  <button className="btn-plan btn-primary" onClick={() => { setShowPricing(false); handleLogin(); }}>Buy Pack</button>
                </div>
                <div className="landing-credit-card">
                  <div className="credit-header">
                    <span className="credit-amount">5,000 credits</span>
                    <div className="credit-price">$35</div>
                  </div>
                  <p className="credit-desc">High capacity for continuous generation and export.</p>
                  <button className="btn-plan btn-secondary" onClick={() => { setShowPricing(false); handleLogin(); }}>Buy Pack</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showEnterprise && (
        <div className="landing-modal-overlay" onClick={() => setShowEnterprise(false)}>
          <div className="landing-modal-box glass-panel neon-glow-purple" onClick={(e) => e.stopPropagation()}>
            <div className="landing-modal-header">
              <div>
                <h3 className="landing-modal-title gradient-text-purple">Omma Enterprise</h3>
                <p className="landing-modal-subtitle">Scale your AI and spatial pipeline with full control</p>
              </div>
              <button className="landing-modal-close" onClick={() => setShowEnterprise(false)}>✕</button>
            </div>
            
            <div className="enterprise-content-layout">
              <div className="enterprise-details">
                <div className="ent-feature">
                  <span className="material-symbols-outlined ent-feature-icon">speed</span>
                  <div>
                    <h4 className="ent-feature-title">Dedicated Compute</h4>
                    <p className="ent-feature-text">High-priority H100 GPU clusters ensuring sub-second execution times for all volumetric simulations.</p>
                  </div>
                </div>
                <div className="ent-feature">
                  <span className="material-symbols-outlined ent-feature-icon">security</span>
                  <div>
                    <h4 className="ent-feature-title">Enterprise Security & SSO</h4>
                    <p className="ent-feature-text">SAML/OIDC SSO, private VPC deployments, SOC2 compliance, and dedicated isolated data systems.</p>
                  </div>
                </div>
                <div className="ent-feature">
                  <span className="material-symbols-outlined ent-feature-icon">schema</span>
                  <div>
                    <h4 className="ent-feature-title">Custom Trained Agents</h4>
                    <p className="ent-feature-text">Fine-tune models on your proprietary CAD blueprints, internal design guidelines, and assets.</p>
                  </div>
                </div>
                <div className="ent-feature">
                  <span className="material-symbols-outlined ent-feature-icon">support_agent</span>
                  <div>
                    <h4 className="ent-feature-title">Dedicated SLA Support</h4>
                    <p className="ent-feature-text">24/7 dedicated support desk with expert solutions engineers, training workshops, and custom integration assistance.</p>
                  </div>
                </div>
              </div>

              <div className="enterprise-form-container glass-panel">
                {enterpriseSubmitted ? (
                  <div className="enterprise-success-state">
                    <span className="material-symbols-outlined success-icon">check_circle</span>
                    <h4 className="success-title">Request Received!</h4>
                    <p className="success-text">Thank you for reaching out. Our enterprise team will contact you within 24 hours to schedule a custom demonstration.</p>
                    <button className="btn-plan btn-primary" style={{ marginTop: 16 }} onClick={() => setShowEnterprise(false)}>Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleEnterpriseSubmit} className="enterprise-form">
                    <h4 className="form-heading">Contact Enterprise Sales</h4>
                    <div className="form-group">
                      <label htmlFor="ent-name">Full Name</label>
                      <input type="text" id="ent-name" required placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ent-email">Work Email</label>
                      <input type="email" id="ent-email" required placeholder="john@company.com" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ent-company">Company Name</label>
                      <input type="text" id="ent-company" required placeholder="Acme Corp" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ent-message">Tell us about your project</label>
                      <textarea id="ent-message" required placeholder="We want to integrate Omma into our spatial visualization workflow..." rows="3" />
                    </div>
                    <button type="submit" className="btn-plan btn-primary">Submit Request</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showChangelog && (
        <div className="landing-modal-overlay" onClick={() => setShowChangelog(false)}>
          <div className="landing-modal-box glass-panel neon-glow-white" onClick={(e) => e.stopPropagation()}>
            <div className="landing-modal-header">
              <div>
                <h3 className="landing-modal-title">What's New</h3>
                <p className="landing-modal-subtitle">Follow the evolution of the Omma spatial web builder</p>
              </div>
              <button className="landing-modal-close" onClick={() => setShowChangelog(false)}>✕</button>
            </div>
            
            <div className="changelog-timeline">
              <div className="changelog-item">
                <div className="changelog-meta">
                  <span className="version-badge v-alpha">v2.0.0-alpha</span>
                  <span className="changelog-date">June 2026</span>
                </div>
                <div className="changelog-details">
                  <h4 className="changelog-title">Parallel Intelligence & Interactive Grids</h4>
                  <ul className="changelog-bullets">
                    <li>Added a high-performance interactive 3D grid and wireframe animation system to the hero page.</li>
                    <li>Introduced parallel agent dashboards with structural logic, physics solving, and PBR materialists.</li>
                    <li>Enabled raw CSV & JSON data mappings directly into volumetric 3D coordinates.</li>
                  </ul>
                </div>
              </div>
              
              <div className="changelog-item">
                <div className="changelog-meta">
                  <span className="version-badge v-beta">v1.9.0-beta</span>
                  <span className="changelog-date">May 2026</span>
                </div>
                <div className="changelog-details">
                  <h4 className="changelog-title">High Fidelity Rendering & Export</h4>
                  <ul className="changelog-bullets">
                    <li>Added full OBJ and GLTF export options for three.js and Unreal Engine 5.</li>
                    <li>Optimized PBR textures and light-reactive reflections.</li>
                    <li>Integrated real-time websocket connections to pipeline inspector.</li>
                  </ul>
                </div>
              </div>

              <div className="changelog-item">
                <div className="changelog-meta">
                  <span className="version-badge v-stable">v1.8.0</span>
                  <span className="changelog-date">April 2026</span>
                </div>
                <div className="changelog-details">
                  <h4 className="changelog-title">Vite Web App Generator Initial Release</h4>
                  <ul className="changelog-bullets">
                    <li>Added complete Vite+React application generator output format.</li>
                    <li>Integrated Stitch design systems engine.</li>
                    <li>Launched documentation viewer and component showcase tabs.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}