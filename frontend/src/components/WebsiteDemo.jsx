import React, { useState } from "react";
import "./WebsiteDemo.css";

export default function WebsiteDemo() {
  const [activeTab, setActiveTab] = useState("design");

  return (
    <div className="mock-browser">
      <div className="browser-header">
        <div className="browser-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>

        <div className="browser-tabs">
          <button
            type="button"
            className={`browser-tab ${activeTab === "design" ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("design");
            }}
          >
            <span className="material-symbols-outlined tab-icon">dashboard</span>
            <span>Design</span>
          </button>
          <button
            type="button"
            className={`browser-tab ${activeTab === "data" ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("data");
            }}
          >
            <span className="material-symbols-outlined tab-icon">insights</span>
            <span>Data</span>
          </button>
          <button
            type="button"
            className={`browser-tab ${activeTab === "code" ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab("code");
            }}
          >
            <span className="material-symbols-outlined tab-icon">code</span>
            <span>Code</span>
          </button>
        </div>
      </div>

      <div className="browser-url">
        <span className="material-symbols-outlined url-lock">lock</span>
        <span className="url-text">omma.build/my-landing</span>
      </div>

      <div className="browser-body">
        {activeTab === "design" && (
          <div className="tab-content content-design">
            <div className="demo-hero">
              <h4 className="demo-hero-title">
                Next-Gen <span className="text-glow-cyan">Vibe</span>
              </h4>
              <p className="demo-hero-desc">Experience web generation at the speed of thought.</p>
              <div className="demo-cta-row">
                <button type="button" className="demo-btn-primary">
                  Launch
                </button>
                <button type="button" className="demo-btn-secondary">
                  Explore
                </button>
              </div>
            </div>

            <div className="demo-grid">
              <div className="demo-card design-card-1">
                <span className="demo-card-label">PERFORMANCE</span>
                <div className="demo-card-val-row">
                  <span className="demo-card-val text-glow-cyan">100</span>
                  <div className="pulse-dot-cyan" />
                </div>
              </div>
              <div className="demo-card design-card-2">
                <span className="demo-card-label">CONVERSION</span>
                <div className="demo-card-val-row">
                  <span className="demo-card-val text-glow-purple">+24%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="tab-content content-data">
            <div className="data-metrics">
              <div className="metric-box">
                <span className="metric-label">ACTIVE USDS</span>
                <span className="metric-val text-glow-cyan">2,841</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">CONV. RATE</span>
                <span className="metric-val text-glow-purple">4.2%</span>
              </div>
            </div>

            <div className="chart-container">
              <svg className="demo-svg-chart" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  className="chart-path"
                  d="M0,35 Q15,10 30,25 T60,15 T90,28 T100,20 L100,40 L0,40 Z"
                  fill="url(#chart-grad)"
                />
                <path
                  className="chart-line"
                  d="M0,35 Q15,10 30,25 T60,15 T90,28 T100,20"
                  fill="none"
                  stroke="var(--neon-cyan)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="tab-content content-code">
            <pre className="code-block">
              <code>
                <span className="code-keyword">const</span> <span className="code-name">App</span> = () =&gt; &#123;{"\n"}
                {"  "}<span className="code-keyword">return</span> ({"\n"}
                {"    "}&lt;<span className="code-tag">div</span> <span className="code-attr">className</span>=<span className="code-str">"hero"</span>&gt;{"\n"}
                {"      "}&lt;<span className="code-tag">h1</span>&gt;Hello World&lt;/<span className="code-tag">h1</span>&gt;{"\n"}
                {"      "}&lt;<span className="code-tag">Button</span> <span className="code-attr">glow</span> /&gt;{"\n"}
                {"    "}&lt;/<span className="code-tag">div</span>&gt;{"\n"}
                {"  "});{"\n"}
                &#125;;
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
