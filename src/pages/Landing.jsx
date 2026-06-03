import React, { useState, useEffect, useRef } from "react";
import "./Landing.css";

export default function Landing({ onBack }) {
	const [shrinkHeader, setShrinkHeader] = useState(false);
	const [promptValue, setPromptValue] = useState("");
	const imgRef = useRef(null);

	// Shrink header on scroll
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setShrinkHeader(true);
			} else {
				setShrinkHeader(false);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Parallax mouse move effect on the hero preview image
	useEffect(() => {
		const handleMouseMove = (e) => {
			if (!imgRef.current) return;
			const amount = 20;
			const x = (e.clientX / window.innerWidth - 0.5) * amount;
			const y = (e.clientY / window.innerHeight - 0.5) * amount;
			imgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const handleEnter = () => {
		if (onBack) {
			onBack();
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleEnter();
		}
	};

	return (
		<div className="omma-landing">
			{/* Fixed Header / TopAppBar */}
			<header className={`omma-header ${shrinkHeader ? "shrink" : ""}`}>
				<div className="header-container">
					<div className="header-left">
						<span 
							className="brand-name" 
							onClick={handleEnter}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => e.key === "Enter" && handleEnter()}
						>
							OMMA
						</span>
						<nav className="nav-menu" aria-label="Main Navigation">
							<a className="nav-link active-link" href="#" onClick={(e) => { e.preventDefault(); handleEnter(); }}>Pricing</a>
							<a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); handleEnter(); }}>Enterprise</a>
							<a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); handleEnter(); }}>Changelog</a>
							<a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); handleEnter(); }}>Docs</a>
						</nav>
					</div>
					<div className="header-right">
						<button type="button" className="btn-login" onClick={handleEnter}>Login</button>
						<button type="button" className="btn-primary" onClick={handleEnter}>Get Started</button>
					</div>
				</div>
			</header>

			<main className="omma-main">
				{/* Hero Section */}
				<section className="omma-hero grid-bg">
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
									onKeyDown={handleKeyDown}
									aria-label="Scene prompt input"
								/>
							</div>
							<button 
								type="button" 
								className="btn-generate text-headline-sm" 
								onClick={handleEnter}
							>
								Generate Scene
							</button>
						</div>
					</div>

					{/* Curved Hero Image Preview Container */}
					<div className="hero-preview-container glass-panel">
						<img
							ref={imgRef}
							alt="3D Cyberpunk Laboratory Scene Preview"
							className="preview-img"
							src="https://lh3.googleusercontent.com/aida/AP1WRLt4lfwIQ5vWbmbZkO34FcAaG9Ktjk4tyGRzLF3FXCWpWcpUxrLT4F-QDqt94zClhU62IhsAhCUvG4wHa7PS488nmRAL-X219CJimvCpXT8M83umNbwPyHZvXvGTfAacKrW3WKxVGJzMesviyJyA7UNAwtIJBgpMWbsxxpfqhjWM6gD3AS78ohC_G5_50jIrkKebgSTCSd2HiiZgzPhST2Ce5ssZWvkCnrpjImJxy6K2bwPg4gNKcdnQPp3Y"
						/>
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
						{/* Websites Card */}
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
								<div className="visual-line-long" />
								<div className="visual-line-short" />
								<div className="visual-panel" />
							</div>
						</div>

						{/* 3D Scenes Card */}
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
									alt="3D Spatial Representation Preview"
									src="https://lh3.googleusercontent.com/aida/AP1WRLt4lfwIQ5vWbmbZkO34FcAaG9Ktjk4tyGRzLF3FXCWpWcpUxrLT4F-QDqt94zClhU62IhsAhCUvG4wHa7PS488nmRAL-X219CJimvCpXT8M83umNbwPyHZvXvGTfAacKrW3WKxVGJzMesviyJyA7UNAwtIJBgpMWbsxxpfqhjWM6gD3AS78ohC_G5_50jIrkKebgSTCSd2HiiZgzPhST2Ce5ssZWvkCnrpjImJxy6K2bwPg4gNKcdnQPp3Y"
								/>
							</div>
						</div>

						{/* Apps Card */}
						<div className="bento-card col-span-4 glass-panel apps-card">
							<div className="card-top">
								<div className="card-icon-wrapper glass-panel cyan-icon">
									<span className="material-symbols-outlined">apps</span>
								</div>
								<h3 className="text-headline-sm card-title">Apps</h3>
								<p className="text-body-sm card-description">
									Full-stack logic and database schemas orchestrated by Omma's core agents.
								</p>
							</div>
						</div>

						{/* Data Card */}
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

						{/* Inspector UI Card */}
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

				{/* Parallel Intelligence (Agents) Section */}
				<section className="omma-section omma-agents-section">
					<div className="section-title text-center">
						<span className="section-eyebrow text-code-label text-center">PARALLEL INTELLIGENCE</span>
						<h2 className="text-display-lg">Parallel Intelligence</h2>
						<p className="text-body-md card-description">
							Run multiple AI agents simultaneously to handle geometry, physics, and lighting in parallel.
						</p>
					</div>

					<div className="agents-grid">
						{/* Agent 1 */}
						<div className="agent-card glass-panel card-border-cyan">
							<div className="agent-header">
								<span className="agent-name cyan-text text-code-label">AGENT_ALPHA</span>
								<span className="agent-badge cyan-badge">ACTIVE</span>
							</div>
							<h4 className="text-headline-sm agent-title">Structural Logic</h4>
							<p className="text-body-sm agent-description">
								Handles architectural integrity and spatial layout constraints.
							</p>
							<div className="eq-container" aria-hidden="true">
								<span className="eq-bar bg-cyan eq-anim-1" />
								<span className="eq-bar bg-cyan eq-anim-2" />
								<span className="eq-bar bg-cyan eq-anim-3" />
							</div>
						</div>

						{/* Agent 2 */}
						<div className="agent-card glass-panel card-border-purple">
							<div className="agent-header">
								<span className="agent-name purple-text text-code-label">AGENT_BETA</span>
								<span className="agent-badge purple-badge">THINKING</span>
							</div>
							<h4 className="text-headline-sm agent-title">PBR Materialist</h4>
							<p className="text-body-sm agent-description">
								Generates ultra-realistic textures and light-reactive surfaces.
							</p>
							<div className="eq-container" aria-hidden="true">
								<span className="eq-bar bg-purple eq-anim-3" />
								<span className="eq-bar bg-purple eq-anim-1" />
								<span className="eq-bar bg-purple eq-anim-2" />
							</div>
						</div>

						{/* Agent 3 */}
						<div className="agent-card glass-panel card-border-white">
							<div className="agent-header">
								<span className="agent-name white-text text-code-label">AGENT_GAMMA</span>
								<span className="agent-badge white-badge">STANDBY</span>
							</div>
							<h4 className="text-headline-sm agent-title">Physics Solver</h4>
							<p className="text-body-sm agent-description">
								Simulates real-world gravity, collision, and fluid dynamics.
							</p>
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
							<button type="button" className="btn-primary btn-cta-primary" onClick={handleEnter}>
								Get Instant Access
							</button>
							<button type="button" className="btn-primary btn-cta-secondary glass-panel" style={{ color: "var(--primary)" }} onClick={handleEnter}>
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
						<a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); handleEnter(); }}>Privacy</a>
						<a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); handleEnter(); }}>Terms</a>
						<a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); handleEnter(); }}>Twitter</a>
						<a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); handleEnter(); }}>Discord</a>
						<a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); handleEnter(); }}>GitHub</a>
					</nav>
				</div>
			</footer>
		</div>
	);
}
