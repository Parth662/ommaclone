import React, { useState, useEffect, useRef } from "react";
import "./Landing.css";

export default function Landing({ onBack, onNavigate }) {
	const [shrinkHeader, setShrinkHeader] = useState(false);
	const [promptValue, setPromptValue] = useState("");
	const canvasRef = useRef(null);

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

		// Camera and mouse settings
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

		// Generative 3D Wireframe buildings representing architectural construction
		const blocks = [
			{ x: 0, z: 0, w: 140, h: 360, d: 140 },
			{ x: -280, z: -150, w: 180, h: 220, d: 180 },
			{ x: 280, z: 150, w: 160, h: 280, d: 160 },
			{ x: -180, z: 350, w: 220, h: 180, d: 220 },
			{ x: 180, z: -250, w: 120, h: 140, d: 120 },
			{ x: -450, z: 100, w: 100, h: 120, d: 100 },
			{ x: 450, z: -100, w: 100, h: 160, d: 100 }
		];

		// Floating data nodes (particles)
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

		// 3D Rotation helper
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
			ctx.clearRect(0, 0, width, height);

			// Smooth rot interpolation
			targetRotY = mouseX * 0.7;
			targetRotX = 0.25 + mouseY * 0.35;
			rotX += (targetRotX - rotX) * 0.05;
			rotY += (targetRotY - rotY) * 0.05;

			const centerX = width / 2;
			const centerY = height / 2 + 80;

			// --- Ground Grid ---
			ctx.strokeStyle = "rgba(0, 240, 255, 0.18)";
			ctx.lineWidth = 1;

			// Z lines
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

			// X lines
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

			// --- Architectural Wireframes ---
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
					[0, 1], [1, 2], [2, 3], [3, 0], // Front face
					[4, 5], [5, 6], [6, 7], [7, 4], // Back face
					[0, 4], [1, 5], [2, 6], [3, 7]  // Pillars
				];

				ctx.lineWidth = 1;
				edges.forEach(([pA, pB]) => {
					const vA = projected[pA];
					const vB = projected[pB];
					if (vA.visible && vB.visible) {
						const avgZ = (vA.z + vB.z) / 2;
						const alpha = Math.max(0.01, 1 - (avgZ + 500) / 1600);
						ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.35})`;
						ctx.beginPath();
						ctx.moveTo(vA.x, vA.y);
						ctx.lineTo(vB.x, vB.y);
						ctx.stroke();
					}
				});

				// Top cap face glow
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

			// --- Draw Particles ---
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

					ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.85})`;
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
							<a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate("docs") : handleEnter(); }}>Docs</a>
						</nav>
					</div>
					<div className="header-right">
						<button type="button" className="btn-login" onClick={handleEnter}>Login</button>
						<button type="button" className="btn-primary" onClick={handleEnter}>Get Started</button>
					</div>
				</div>
			</header>

			<main className="omma-main">
				{/* Hero Section with 3D Background */}
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
