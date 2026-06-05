import React, { useState, useEffect, useRef } from "react";
import "./Docs.css";

const ARTICLES = {
  introduction: {
    title: "Introduction",
    subtitle: "Welcome to Omma — the AI-powered creative studio for building interactive 3D experiences, websites, and apps using natural language.",
    category: "Getting Started",
    render: (selectArticle) => (
      <>
        <h2>Welcome to Omma</h2>
        <p>Omma is an AI-powered creative studio that lets you build interactive 3D scenes, generate images, convert images to 3D models, and create web experiences — all through natural language conversation.</p>
        <p>Whether you're a designer exploring 3D for the first time, a developer prototyping interactive experiences, or a creative professional building production-ready projects, Omma gives you the tools to bring your ideas to life.</p>

        <h2>What You Can Build</h2>
        <p>With Omma, you can create:</p>
        <ul>
          <li><strong>Interactive 3D scenes</strong> — Build 3D experiences with lighting, materials, animations, and camera controls</li>
          <li><strong>Websites and web apps</strong> — Generate HTML, CSS, and JavaScript for responsive web pages</li>
          <li><strong>Images</strong> — Generate images using AI</li>
          <li><strong>3D models</strong> — Convert images to 3D models</li>
          <li><strong>React components</strong> — Create reusable UI components with React and JSX</li>
          <li><strong>Games and interactive experiences</strong> — Build browser-based games with keyboard controls and physics</li>
        </ul>

        <h2>How It Works</h2>
        <ol>
          <li><strong>Describe what you want</strong> — Type a natural language description of what you'd like to create</li>
          <li><strong>AI generates code</strong> — Omma uses AI to generate the code for your project</li>
          <li><strong>Live preview</strong> — See your creation rendered in real-time in the preview panel</li>
          <li><strong>Iterate and refine</strong> — Continue the conversation to modify, enhance, and perfect your project</li>
          <li><strong>Publish and share</strong> — Share your creation with a public URL or custom domain</li>
        </ol>

        <h2>Next Steps</h2>
        <div className="docs-next-steps-grid">
          <div className="next-step-card" onClick={() => selectArticle("what-is-omma")}>
            <span className="next-step-icon">🎯</span>
            <div className="next-step-info">
              <strong>What is Omma?</strong>
              <p>Deep dive into the platform and its capabilities</p>
            </div>
          </div>
          <div className="next-step-card" onClick={() => selectArticle("quickstart")}>
            <span className="next-step-icon">⚡</span>
            <div className="next-step-info">
              <strong>Quickstart</strong>
              <p>Create your first project in minutes</p>
            </div>
          </div>
          <div className="next-step-card" onClick={() => selectArticle("ai-chat")}>
            <span className="next-step-icon">💬</span>
            <div className="next-step-info">
              <strong>AI Chat</strong>
              <p>Learn how to use the AI chat interface</p>
            </div>
          </div>
          <div className="next-step-card" onClick={() => selectArticle("3d-scene-builder")}>
            <span className="next-step-icon">🎨</span>
            <div className="next-step-info">
              <strong>3D Scene Builder</strong>
              <p>Build interactive 3D scenes</p>
            </div>
          </div>
        </div>
      </>
    )
  },
  "what-is-omma": {
    title: "What is Omma?",
    subtitle: "An overview of Omma, the AI-powered creative studio for building interactive experiences.",
    category: "Getting Started",
    render: () => (
      <>
        <h2>Overview</h2>
        <p>Omma is an AI creative studio that combines AI-powered code generation with a live preview environment, allowing you to describe what you want in natural language and see it rendered in real-time.</p>
        <p>At its core, Omma uses AI to understand your intent and generate the corresponding code — whether that's a 3D scene, an HTML website, a React component, or an interactive game.</p>

        <h2>Key Capabilities</h2>
        
        <h3>AI-Powered Generation</h3>
        <p>Omma leverages AI to understand complex creative requests and generate production-quality code. The AI can:</p>
        <ul>
          <li>Interpret natural language descriptions of 3D scenes, websites, and interactive experiences</li>
          <li>Generate 3D code with proper scene setup, lighting, materials, and animations</li>
          <li>Create responsive HTML/CSS/JS websites</li>
          <li>Build React/JSX components</li>
          <li>Understand and apply design references and visual inspiration</li>
        </ul>

        <h3>Live Code Preview</h3>
        <p>Every project includes a real-time preview that updates as the AI generates or modifies code. The preview supports:</p>
        <ul>
          <li><strong>3D</strong> — Full 3D rendering in the browser</li>
          <li><strong>HTML/CSS/JS</strong> — Standard web content rendering</li>
          <li><strong>JSX/React</strong> — Component-based UI rendering</li>
          <li><strong>Keyboard controls</strong> — For interactive games and experiences</li>
        </ul>

        <h3>Code Editor</h3>
        <p>A built-in code editor lets you directly edit the generated code with:</p>
        <ul>
          <li>Syntax highlighting for JavaScript, HTML, CSS, and JSX</li>
          <li>Code versioning and history</li>
          <li>Auto-fix for broken code</li>
          <li>Full undo/redo support</li>
        </ul>

        <h3>Image Generation</h3>
        <p>Generate images using AI. Use the <code>/imagine</code> command in chat or describe what you want to see.</p>

        <h3>3D Model Generation</h3>
        <p>Convert images to 3D models using AI. Generated models are automatically optimized for web performance.</p>

        <h3>Publishing</h3>
        <p>Publish your projects to the web with:</p>
        <ul>
          <li>Unique shareable URLs on <code>omma.build</code></li>
          <li>Custom domain support</li>
          <li>SEO-optimized public pages</li>
          <li>Community gallery</li>
        </ul>

        <h2>Who Is Omma For?</h2>
        <ul>
          <li><strong>Designers</strong> — Explore 3D design without writing code</li>
          <li><strong>Developers</strong> — Rapidly prototype interactive experiences</li>
          <li><strong>Creators</strong> — Build and publish interactive content</li>
          <li><strong>Students</strong> — Learn 3D and web development with AI assistance</li>
          <li><strong>Teams</strong> — Collaborate on creative projects with shared workspaces</li>
        </ul>
      </>
    )
  },
  quickstart: {
    title: "Quickstart",
    subtitle: "Create your first project with Omma in just a few minutes.",
    category: "Getting Started",
    render: (selectArticle) => (
      <>
        <h2>Create Your First Project</h2>
        <p>Get up and running with Omma in minutes. This guide walks you through creating your first interactive 3D scene.</p>

        <h3>1. Sign in to Omma</h3>
        <p>Visit <code>omma.build</code> and sign in with your Google account. New accounts get free credits to start creating.</p>

        <h3>2. Start a new chat</h3>
        <p>From the home page, you'll see a prompt input. Type a description of what you want to create. For example:</p>
        <div className="article-code-block">
          <div className="code-block-header">
            <span className="code-block-lang">Prompt</span>
          </div>
          <pre><code><span className="code-string">"Create a 3D scene with a rotating cube that changes color when clicked. The cube should have a metallic material and there should be ambient lighting with a soft shadow."</span></code></pre>
        </div>

        <h3>3. Watch the AI generate your project</h3>
        <p>Omma will process your request and generate code. You'll see:</p>
        <ul>
          <li>A live preview of your 3D scene on the right</li>
          <li>The generated code in the editor panel</li>
          <li>Chat messages explaining what was created</li>
        </ul>

        <h3>4. Iterate and refine</h3>
        <p>Continue the conversation to modify your project:</p>
        <div className="article-code-block">
          <div className="code-block-header">
            <span className="code-block-lang">Prompt</span>
          </div>
          <pre><code><span className="code-string">"Add a floor plane with a grid texture, and make the cube bounce up and down with a smooth animation."</span></code></pre>
        </div>
        <p>The AI will update the code and the preview will refresh automatically.</p>

        <h3>5. Publish your project</h3>
        <p>When you're happy with your creation, click the <strong>Publish</strong> button to get a shareable URL. Your project will be accessible at <code>omma.build/p/your-project-slug</code>.</p>

        <h2>Example Prompts</h2>
        <p>Here are some prompts to try:</p>

        <h3>3D Scenes</h3>
        <div className="article-code-block">
          <div className="code-block-header">
            <span className="code-block-lang">Prompt</span>
          </div>
          <pre><code><span className="code-string">"Create a solar system with orbiting planets. Each planet should have different colors and sizes. Add a starfield background."</span></code></pre>
        </div>

        <h3>Websites</h3>
        <div className="article-code-block">
          <div className="code-block-header">
            <span className="code-block-lang">Prompt</span>
          </div>
          <pre><code><span className="code-string">"Build a modern landing page for a coffee shop with a hero section, menu grid, and contact form. Use warm earth tones."</span></code></pre>
        </div>

        <h3>Interactive Games</h3>
        <div className="article-code-block">
          <div className="code-block-header">
            <span className="code-block-lang">Prompt</span>
          </div>
          <pre><code><span className="code-string">"Make a simple 3D platformer game where a ball rolls on platforms. Use arrow keys to move and space to jump."</span></code></pre>
        </div>

        <h3>Image Generation</h3>
        <div className="article-code-block">
          <div className="code-block-header">
            <span className="code-block-lang">Prompt</span>
          </div>
          <pre><code><span className="code-string">"/imagine a futuristic city skyline at sunset with flying cars"</span></code></pre>
        </div>

        <h2>What's Next</h2>
        <div className="docs-next-steps-grid">
          <div className="next-step-card" onClick={() => selectArticle("ai-chat")}>
            <span className="next-step-icon">💬</span>
            <div className="next-step-info">
              <strong>AI Chat</strong>
              <p>Master the chat interface</p>
            </div>
          </div>
          <div className="next-step-card" onClick={() => selectArticle("3d-scene-builder")}>
            <span className="next-step-icon">🎨</span>
            <div className="next-step-info">
              <strong>3D Scene Builder</strong>
              <p>Deep dive into 3D capabilities</p>
            </div>
          </div>
        </div>
      </>
    )
  },
  "ai-chat": {
    title: "AI Chat",
    subtitle: "Collaborate with Forge AI to design and script.",
    category: "Features",
    render: () => (
      <>
        <p>Forge AI Chat is your collaborative interface. Rather than rewriting prompts from scratch, use conversational messages to refine your scenes, tweak layouts, or add animation triggers.</p>
        <h2>Using Chat Prompts</h2>
        <p>You can ask Chat to apply incremental changes, add features, or explain how a specific component works:</p>
        <ul>
          <li><em>"Add a rotating logo to the top navbar."</em></li>
          <li><em>"Change the secondary theme color to neon purple."</em></li>
          <li><em>"Connect the vertices count data in the CSV file to the height of the 3D bars."</em></li>
        </ul>
        <div className="article-callout">
          <div className="callout-title">💡 Pro-Tip</div>
          <div className="callout-text">AI Chat keeps context of previous scene renders, allowing you to iterate iteratively on the same project.</div>
        </div>
      </>
    )
  },
  "3d-scene-builder": {
    title: "3D Scene Builder",
    subtitle: "Build interactive 3D scenes with AI-powered code generation.",
    category: "Features",
    render: () => (
      <>
        <h2>3D Scene Builder</h2>
        <p>Omma's 3D scene builder renders interactive 3D scenes directly in the browser. The AI generates complete scene code including geometry, materials, lighting, animations, and camera controls.</p>

        <h2>Supported Features</h2>
        
        <div className="docs-features-container">
          {/* Geometries section */}
          <div className="docs-feature-section">
            <h3>Geometries</h3>
            <div className="docs-pills-list">
              <span className="docs-pill">Box</span>
              <span className="docs-pill">Sphere</span>
              <span className="docs-pill">Cylinder</span>
              <span className="docs-pill">Cone</span>
              <span className="docs-pill">Torus</span>
              <span className="docs-pill">Plane</span>
              <span className="docs-pill">Circle</span>
              <span className="docs-pill">Ring</span>
              <span className="docs-pill">Custom BufferGeometry</span>
              <span className="docs-pill">ExtrudeGeometry</span>
              <span className="docs-pill">LatheGeometry</span>
              <span className="docs-pill">Text geometry (via font loaders)</span>
            </div>
          </div>

          <div className="docs-feature-grid">
            {/* Materials section */}
            <div className="docs-feature-card">
              <h3>Materials</h3>
              <ul className="docs-feature-list">
                <li><strong>MeshStandardMaterial</strong> — PBR material with roughness and metalness</li>
                <li><strong>MeshPhongMaterial</strong> — Classic Phong shading</li>
                <li><strong>MeshBasicMaterial</strong> — Unlit material</li>
                <li><strong>MeshPhysicalMaterial</strong> — Advanced PBR with clearcoat, transmission</li>
                <li><strong>ShaderMaterial</strong> — Custom GLSL shaders</li>
              </ul>
            </div>

            {/* Lighting section */}
            <div className="docs-feature-card">
              <h3>Lighting</h3>
              <ul className="docs-feature-list">
                <li><strong>AmbientLight</strong> — Uniform ambient illumination</li>
                <li><strong>DirectionalLight</strong> — Sun-like directional light with shadows</li>
                <li><strong>PointLight</strong> — Omnidirectional point source</li>
                <li><strong>SpotLight</strong> — Focused cone of light</li>
                <li><strong>HemisphereLight</strong> — Sky/ground gradient light</li>
                <li><strong>RectAreaLight</strong> — Area light source</li>
              </ul>
            </div>

            {/* Controls section */}
            <div className="docs-feature-card">
              <h3>Controls</h3>
              <ul className="docs-feature-list">
                <li><strong>OrbitControls</strong> — Mouse orbit, zoom, and pan</li>
                <li><strong>Keyboard controls</strong> for games (WASD, arrow keys)</li>
                <li><strong>Raycasting</strong> for click interaction</li>
                <li><strong>Touch controls</strong> for mobile</li>
              </ul>
            </div>

            {/* Post-Processing section */}
            <div className="docs-feature-card">
              <h3>Post-Processing</h3>
              <ul className="docs-feature-list">
                <li>Bloom effects</li>
                <li>Anti-aliasing (MSAA, FXAA)</li>
                <li>Environment maps</li>
                <li>Shadow mapping</li>
              </ul>
            </div>
          </div>
        </div>

        <h2>3D Model Loading</h2>
        
        <div className="docs-models-grid">
          <div className="docs-model-card">
            <h3>3D Models</h3>
            <p>Omma supports loading 3D models in GLB format with automatic optimization for web performance.</p>
          </div>
          <div className="docs-model-card">
            <h3>Model Library</h3>
            <p>Omma includes a model library of 3D models that can be referenced in scenes. The AI knows about available models and can insert them into your scenes automatically.</p>
          </div>
        </div>

        <h2>Performance Tips</h2>
        <div className="article-callout performance-callout">
          <div className="callout-title">
            <span className="callout-icon">⚡</span>
            Performance
          </div>
          <div className="callout-text">
            <p>Keep your scenes performant by following these guidelines.</p>
            <ul style={{ paddingLeft: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>Use standard materials over advanced physical materials when possible</li>
              <li>Limit the number of lights with shadows enabled</li>
              <li>Use instanced rendering for repeated objects</li>
              <li>Keep polygon counts reasonable for web rendering</li>
              <li>Use optimized GLB models</li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  "image-generation": {
    title: "Image Generation",
    subtitle: "Generate concept art and background maps.",
    category: "Features",
    render: () => (
      <>
        <p>Omma integrates a latent diffusion image engine. Generate background skybox cubemaps, UI assets, and placeholder image concept textures directly from your workspace.</p>
        <h2>Generating Skyboxes</h2>
        <p>To generate a skybox, select the sky layer in your scene properties and describe the environment (e.g. <em>"A deep cosmic nebula with purple gas clouds"</em>).</p>
      </>
    )
  },
  "code-editor": {
    title: "Code Editor",
    subtitle: "Inspect, format, and edit generated React components.",
    category: "Features",
    render: () => (
      <>
        <p>For developers, Omma exposes a built-in code terminal. View the raw JSX and CSS generated by our agents, edit parameters manually, and see edits hot-reloaded in the viewport.</p>
        <div className="article-code-block">
          <div className="code-block-header">
            <span className="code-block-lang">Vite Config</span>
          </div>
          <pre><code><span className="code-keyword">import</span> &#123; defineConfig &#125; <span className="code-keyword">from</span> <span className="code-string">"vite"</span>;<br /><span className="code-keyword">import</span> react <span className="code-keyword">from</span> <span className="code-string">"@vitejs/plugin-react"</span>;<br /><br /><span className="code-keyword">export</span> <span className="code-keyword">default</span> defineConfig(&#123;<br />  plugins: [react()],<br />&#125;);</code></pre>
        </div>
      </>
    )
  },
  publishing: {
    title: "Publishing",
    subtitle: "Deploy your spatial websites in one click.",
    category: "Features",
    render: () => (
      <>
        <p>Ready to share your creation? Omma includes classic static hosting support. Click <strong>Publish</strong> to deploy your app directly onto a global CDN network.</p>
      </>
    )
  },
  "building-3d-scenes": {
    title: "Building 3D Scenes",
    subtitle: "Step-by-step tutorial for spatial web developers.",
    category: "Guides",
    render: () => (
      <>
        <p>This guide walks you through building a fully-interactive 3D cityscape using natural language prompts and importing CSV height profiles.</p>
        <h2>Phase 1: Setting the Grid</h2>
        <p>Begin by asking for a structural ground plane: <em>"Set up a grid plane with a size of 12x12 nodes, glowing turquoise lines."</em></p>
        <h2>Phase 2: Spawning Wireframes</h2>
        <p>Spawn structural buildings: <em>"Generate 5 tall vertical buildings of varying heights with outline wireframes."</em></p>
        <h2>Phase 3: Adding Fog & Depth</h2>
        <p>Increase atmosphere: <em>"Set up a dark fog that starts at 500 units and fades out at Z=1500."</em></p>
      </>
    )
  },
  "creating-websites": {
    title: "Creating Websites",
    subtitle: "Tutorial: Building landing pages and layouts.",
    category: "Guides",
    render: () => (
      <>
        <p>Learn how to instruct the AI agents to build standard pages like blogs, pricing grids, and hero call-to-actions, styled with beautiful animations.</p>
      </>
    )
  },
  "using-components": {
    title: "Using Components",
    subtitle: "Import and reuse generated elements.",
    category: "Guides",
    render: () => (
      <>
        <p>Learn how to extract components (such as interactive forms, charts, and navigations) and copy them directly into your existing codebase.</p>
      </>
    )
  },
  "custom-domains": {
    title: "Custom Domains",
    subtitle: "Route your published websites to custom URLs.",
    category: "Advanced",
    render: () => (
      <>
        <p>Connect your domain (e.g. `yourportfolio.com`) by adding CNAME and A-records in your DNS panel pointing to Omma's server IP addresses.</p>
      </>
    )
  },
  "credits-billing": {
    title: "Credits & Billing",
    subtitle: "Understand credits, pipelines, and premium features.",
    category: "Advanced",
    render: () => (
      <>
        <p>Each generation call consumes credits. The quickstart workspace starts on a Free Plan with 0 credits, which allows full preview rendering but limited exports.</p>
      </>
    )
  },
  "keyboard-shortcuts": {
    title: "Keyboard Shortcuts",
    subtitle: "Accelerate your creation workflow with shortcuts.",
    category: "Advanced",
    render: () => (
      <>
        <p>Speed up editing with keyboard key combinations:</p>
        <ul>
          <li><strong>⌘ + K:</strong> Open docs search.</li>
          <li><strong>⌘ + Enter:</strong> Generate scene prompt.</li>
          <li><strong>ESC:</strong> Close modals and popovers.</li>
          <li><strong>F:</strong> Focus viewport camera on center element.</li>
        </ul>
      </>
    )
  }
};

const SIDEBAR_STRUCTURE = [
  {
    icon: "🚀",
    label: "Getting Started",
    links: [
      { id: "introduction", label: "Introduction" },
      { id: "what-is-omma", label: "What is Omma?" },
      { id: "quickstart", label: "Quickstart" }
    ]
  },
  {
    icon: "✨",
    label: "Features",
    links: [
      { id: "ai-chat", label: "AI Chat" },
      { id: "3d-scene-builder", label: "3D Scene Builder" },
      { id: "image-generation", label: "Image Generation" },
      { id: "code-editor", label: "Code Editor" },
      { id: "publishing", label: "Publishing" }
    ]
  },
  {
    icon: "📖",
    label: "Guides",
    links: [
      { id: "building-3d-scenes", label: "Building 3D Scenes" },
      { id: "creating-websites", label: "Creating Websites" },
      { id: "using-components", label: "Using Components" }
    ]
  },
  {
    icon: "⚙️",
    label: "Advanced",
    links: [
      { id: "custom-domains", label: "Custom Domains" },
      { id: "credits-billing", label: "Credits & Billing" },
      { id: "keyboard-shortcuts", label: "Keyboard Shortcuts" }
    ]
  }
];

export default function Docs({ onBack }) {
  const [activeArticle, setActiveArticle] = useState("home"); // "home" or key of ARTICLES
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  
  // Ask AI Chat State
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "Hey! I'm the Omma Docs Assistant. Ask me anything about setting up 3D viewports, components, code exports, or custom domains!" }
  ]);
  const [aiInputValue, setAiInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const searchInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const canvasRef = useRef(null);

  // Focus search input when ⌘K is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setAiModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3D Moving Shapes Backdrop Canvas Animation
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

    // Track mouse coordinates and movement velocity
    let mouse = { 
      x: width / 2, 
      y: height / 2, 
      tx: width / 2, 
      ty: height / 2,
      activity: 0.02 // default base glow level
    };

    const handleMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      // Surge activity up to 1.0 when mouse is moving
      mouse.activity = Math.min(1.0, mouse.activity + 0.15);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 3D Projection & Camera settings
    const FL = 450; // Focal length

    const rotateX = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x, y * cos - z * sin, y * sin + z * cos];
    };

    const rotateY = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x * cos + z * sin, y, -x * sin + z * cos];
    };

    const rotateZ = (x, y, z, angle) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x * cos - y * sin, x * sin + y * cos, z];
    };

    // Geometries blueprints (vertices scaled in [-1, 1] bounds)
    const CUBE_VERTICES = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];
    const CUBE_FACES = [
      [0, 1, 2, 3], // back
      [4, 5, 6, 7], // front
      [0, 1, 5, 4], // top
      [3, 2, 6, 7], // bottom
      [0, 3, 7, 4], // left
      [1, 2, 6, 5]  // right
    ];

    const PYRAMID_VERTICES = [
      [0, -1.2, 0], // apex
      [-1, 0.8, -1], [1, 0.8, -1], [1, 0.8, 1], [-1, 0.8, 1] // base
    ];
    const PYRAMID_FACES = [
      [1, 2, 3, 4], // base
      [0, 1, 2],    // side 1
      [0, 2, 3],    // side 2
      [0, 3, 4],    // side 3
      [0, 4, 1]     // side 4
    ];

    const OCTAHEDRON_VERTICES = [
      [0, -1.4, 0], [0, 1.4, 0], // apexes
      [-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1] // ring
    ];
    const OCTAHEDRON_FACES = [
      [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 2], // top pyramids
      [1, 2, 3], [1, 3, 4], [1, 4, 5], [1, 5, 2]  // bottom pyramids
    ];

    // Array of 3D objects
    const shapes = [];
    const shapeTypes = ["cube", "pyramid", "octahedron"];
    const colors = [
      { rgb: "0, 240, 255" }, // Cyan
      { rgb: "188, 0, 255" }  // Purple
    ];

    // Spawn 14 glassmorphic objects drifting through space
    for (let i = 0; i < 14; i++) {
      shapes.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 800 - 200,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.25,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        rvx: (Math.random() - 0.5) * 0.005,
        rvy: (Math.random() - 0.5) * 0.005,
        rvz: (Math.random() - 0.5) * 0.005,
        size: Math.random() * 40 + 40,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const drawLoop = () => {
      // Clear viewport
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Decay mouse activity back to idle state
      mouse.activity += (0.02 - mouse.activity) * 0.04;

      // Smooth mouse follow
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // Small parallax translation based on mouse coords
      const offsetX = (mouse.x - width / 2) * 0.05;
      const offsetY = (mouse.y - height / 2) * 0.05;

      const allFaces = [];

      shapes.forEach((shape) => {
        // Apply velocity
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.z += shape.vz;

        // Apply rotation
        shape.rx += shape.rvx;
        shape.ry += shape.rvy;
        shape.rz += shape.rvz;

        // Loop space bounds
        if (shape.z > 800) shape.z = -200;
        if (shape.z < -200) shape.z = 800;

        const rangeX = width / 2 + 250;
        const rangeY = height / 2 + 250;
        if (shape.x > rangeX) shape.x = -rangeX;
        if (shape.x < -rangeX) shape.x = rangeX;
        if (shape.y > rangeY) shape.y = -rangeY;
        if (shape.y < -rangeY) shape.y = rangeY;

        let vertices = [];
        let faces = [];
        if (shape.type === "cube") {
          vertices = CUBE_VERTICES;
          faces = CUBE_FACES;
        } else if (shape.type === "pyramid") {
          vertices = PYRAMID_VERTICES;
          faces = PYRAMID_FACES;
        } else {
          vertices = OCTAHEDRON_VERTICES;
          faces = OCTAHEDRON_FACES;
        }

        // Project vertices onto screen coordinate plane
        const projectedPoints = vertices.map((vertex) => {
          let px = vertex[0] * shape.size;
          let py = vertex[1] * shape.size;
          let pz = vertex[2] * shape.size;

          // Rotations
          let [rx_x, rx_y, rx_z] = rotateX(px, py, pz, shape.rx);
          let [ry_x, ry_y, ry_z] = rotateY(rx_x, rx_y, rx_z, shape.ry);
          let [rz_x, rz_y, rz_z] = rotateZ(ry_x, ry_y, ry_z, shape.rz);

          // Absolute positions with mouse offset parallax
          let absX = rz_x + shape.x + offsetX;
          let absY = rz_y + shape.y + offsetY;
          let absZ = rz_z + shape.z;

          // Camera focal multiplier
          const fFactor = FL / (absZ + FL);
          const screenX = absX * fFactor + width / 2;
          const screenY = absY * fFactor + height / 2;

          return { x: screenX, y: screenY, z: absZ };
        });

        // Compute 2D screen center of shape for mouse proximity checking
        let screenCenterX = 0;
        let screenCenterY = 0;
        projectedPoints.forEach(p => {
          screenCenterX += p.x;
          screenCenterY += p.y;
        });
        screenCenterX /= projectedPoints.length;
        screenCenterY /= projectedPoints.length;

        // Proximity factor based on distance to cursor
        const dx = screenCenterX - mouse.x;
        const dy = screenCenterY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const proximityFactor = Math.max(0, 1 - distance / 320); // active within 320px

        // Shape activity combines general cursor movement and proximity glow
        const shapeActivity = Math.max(mouse.activity, proximityFactor);

        // Gather faces for depth sorting
        faces.forEach((faceIndices) => {
          const facePoints = faceIndices.map(idx => projectedPoints[idx]);
          
          let avgZ = 0;
          facePoints.forEach(p => { avgZ += p.z; });
          avgZ /= facePoints.length;

          allFaces.push({
            points: facePoints,
            avgZ: avgZ,
            rgb: shape.color.rgb,
            activity: shapeActivity
          });
        });
      });

      // Painter's algorithm - Sort faces back-to-front (depth sorting)
      allFaces.sort((a, b) => b.avgZ - a.avgZ);

      // Render glassmorphic faces
      allFaces.forEach((face) => {
        if (face.points.some(p => p.z + FL <= 10)) return;

        ctx.beginPath();
        ctx.moveTo(face.points[0].x, face.points[0].y);
        for (let i = 1; i < face.points.length; i++) {
          ctx.lineTo(face.points[i].x, face.points[i].y);
        }
        ctx.closePath();

        // Opacity bounds based on activity (movement + hover proximity)
        const baseFill = 0.005;
        const maxFill = 0.12;
        const baseStroke = 0.03;
        const maxStroke = 0.28;

        const fillOpacity = baseFill + (maxFill - baseFill) * face.activity;
        const strokeOpacity = baseStroke + (maxStroke - baseStroke) * face.activity;

        // Draw translucent body fill
        ctx.fillStyle = `rgba(${face.rgb}, ${fillOpacity})`;
        ctx.fill();

        // Draw border edge
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${face.rgb}, ${strokeOpacity})`;
        ctx.stroke();

        // Draw tiny glow nodes at corners
        ctx.fillStyle = `rgba(${face.rgb}, ${strokeOpacity + 0.1})`;
        face.points.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      animationFrameId = requestAnimationFrame(drawLoop);
    };

    drawLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const selectArticle = (id) => {
    setActiveArticle(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const handleAskAISubmit = (e) => {
    e.preventDefault();
    if (!aiInputValue.trim()) return;

    const userText = aiInputValue;
    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);
    setAiInputValue("");
    setIsAiTyping(true);

    // Dynamic mock response logic based on user keywords
    setTimeout(() => {
      let aiResponseText = "";
      const lowerText = userText.toLowerCase();

      if (lowerText.includes("3d") || lowerText.includes("scene") || lowerText.includes("mesh")) {
        aiResponseText = "To construct 3D scenes, write a prompt in the Forge Studio bar like 'A futuristic cyberpunk laboratory...'. The volumetric Three.js canvas renders the grid and elements automatically. Read more in our **[Building 3D Scenes](#)** guide!";
      } else if (lowerText.includes("pricing") || lowerText.includes("credits") || lowerText.includes("billing")) {
        aiResponseText = "Forge AI starts on a Free Plan with 0 credits, which is perfect for scene visualization. To unlock full React code exporting or premium layouts, you can purchase credit bundles by clicking **Upgrade** in the sidebar footer profile menu!";
      } else if (lowerText.includes("export") || lowerText.includes("code") || lowerText.includes("react")) {
        aiResponseText = "Yes, Omma generates standard React JSX components and vanilla CSS styles. You can view the code directly in the code inspector page or export it as a ZIP that compiles cleanly using standard npm tools.";
      } else if (lowerText.includes("domain") || lowerText.includes("cname")) {
        aiResponseText = "To publish to a custom domain, point your domain provider's DNS panel A-record and CNAME records to our server ip address. Check the **[Custom Domains](#)** tab in Advanced options for values!";
      } else {
        aiResponseText = "That is a great question! You can review details on this within our **Getting Started** section. Feel free to ask me other questions about meshes, exporting JSX, or hosting!";
      }

      setChatMessages((prev) => [...prev, { role: "ai", text: aiResponseText }]);
      setIsAiTyping(false);
    }, 1000);
  };

  // Filter sidebar structure based on search query
  const filteredNav = SIDEBAR_STRUCTURE.map((group) => {
    const matchingLinks = group.links.filter(
      (link) =>
        link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ARTICLES[link.id]?.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...group, links: matchingLinks };
  }).filter((group) => group.links.length > 0);

  const activeArticleData = ARTICLES[activeArticle];

  return (
    <div className="omma-docs">
      {/* Moving Shapes Backdrop Canvas */}
      <canvas ref={canvasRef} className="docs-bg-canvas" />

      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className={`docs-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="docs-brand-header" onClick={() => selectArticle("home")}>
          <span className="docs-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </span>
          <span className="docs-brand-title">Omma Docs</span>
        </div>

        <div className="docs-nav-scroller">
          {filteredNav.length > 0 ? (
            filteredNav.map((group) => (
              <div key={group.label} className="docs-nav-group">
                <span className="docs-group-label text-code-label">
                  <span className="docs-group-icon">{group.icon}</span>
                  {group.label}
                </span>
                {group.links.map((link) => (
                  <span
                    key={link.id}
                    className={`docs-nav-link ${activeArticle === link.id ? "active" : ""}`}
                    onClick={() => selectArticle(link.id)}
                  >
                    {link.label}
                  </span>
                ))}
              </div>
            ))
          ) : (
            <div className="docs-group-label text-code-label" style={{ color: "var(--text-muted)" }}>
              No results found
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="docs-main-container">
        {/* Sticky Topbar */}
        <header className="docs-topbar">
          <div className="docs-search-container">
            <span className="docs-search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              className="docs-search-input"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search documentation"
            />
            <span className="search-hotkey">⌘K</span>
          </div>

          <div className="docs-header-actions">
            <button type="button" className="btn-ask-ai text-code-label" onClick={() => setAiModalOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline></svg>
              Ask AI
            </button>
            <button type="button" className="btn-back text-code-label" onClick={onBack}>
              Back to App
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="docs-content-viewport">
          {activeArticle === "home" ? (
            /* DEFAULT HOMEPAGE */
            <div className="docs-homepage">
              <div className="docs-hero">
                <div className="docs-badge">
                  <span className="material-symbols-outlined docs-badge-icon">menu_book</span>
                  <span className="docs-badge-text text-code-label">Documentation</span>
                </div>
                <h1 className="docs-hero-title">Build with Omma</h1>
                <p className="docs-hero-subtitle text-body-md">
                  Learn how to create interactive 3D scenes, generate images, build websites, and more using AI-powered natural language.
                </p>
              </div>

              {/* Bento Grid */}
              <div className="docs-cards-grid">
                <div className="docs-card card-getting-started" onClick={() => selectArticle("introduction")}>
                  <div className="docs-card-header">
                    <div className="docs-card-icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <h3 className="docs-card-title">Getting Started</h3>
                  </div>
                  <p className="docs-card-desc">
                    Start building with Omma in minutes. Learn the basics and create your first project.
                  </p>
                </div>

                <div className="docs-card card-features" onClick={() => selectArticle("ai-chat")}>
                  <div className="docs-card-header">
                    <div className="docs-card-icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <h3 className="docs-card-title">Features</h3>
                  </div>
                  <p className="docs-card-desc">
                    Explore AI chat, 3D scene building, image generation, code editing, and more.
                  </p>
                </div>

                <div className="docs-card card-guides" onClick={() => selectArticle("building-3d-scenes")}>
                  <div className="docs-card-header">
                    <div className="docs-card-icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    </div>
                    <h3 className="docs-card-title">Guides</h3>
                  </div>
                  <p className="docs-card-desc">
                    Step-by-step tutorials for building 3D scenes, websites, and interactive experiences.
                  </p>
                </div>
              </div>

              {/* Popular Topics List */}
              <div className="docs-popular-topics">
                <h3 className="docs-section-heading">Popular Topics</h3>
                <div className="topics-list">
                  <div className="topic-row" onClick={() => selectArticle("what-is-omma")}>
                    <div className="topic-meta">
                      <span className="topic-title">What is Omma?</span>
                      <span className="topic-desc">Overview of the platform and its capabilities</span>
                    </div>
                    <span className="topic-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </span>
                  </div>

                  <div className="topic-row" onClick={() => selectArticle("building-3d-scenes")}>
                    <div className="topic-meta">
                      <span className="topic-title">Creating 3D Scenes</span>
                      <span className="topic-desc">Build interactive Three.js scenes with AI</span>
                    </div>
                    <span className="topic-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </span>
                  </div>

                  <div className="topic-row" onClick={() => selectArticle("image-generation")}>
                    <div className="topic-meta">
                      <span className="topic-title">Image Generation</span>
                      <span className="topic-desc">Generate background cubemaps and concept textures</span>
                    </div>
                    <span className="topic-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeArticleData ? (
            /* DETAILED DOCUMENTATION VIEW */
            <article className="docs-article-view">
              <nav className="article-breadcrumb text-code-label" aria-label="Breadcrumb">
                <span>Docs</span>
                <span className="breadcrumb-separator">/</span>
                <span>{activeArticleData.category}</span>
                <span className="breadcrumb-separator">/</span>
                <span style={{ color: "var(--text-primary)" }}>{activeArticleData.title}</span>
              </nav>

              <header className="article-header">
                <h1 className="article-title">{activeArticleData.title}</h1>
                <p className="article-subtitle text-body-md">{activeArticleData.subtitle}</p>
              </header>

              <div className="article-body">
                {activeArticleData.render(selectArticle)}
              </div>
            </article>
          ) : (
            /* FALLBACK FOR SEARCH/EMPTY STATES */
            <div className="search-empty-state">
              <span className="material-symbols-outlined search-empty-icon">search_off</span>
              <p>Article not found or matching your search criteria.</p>
            </div>
          )}
        </main>
      </div>

      {/* ASK AI FLOATING OVERLAY MODAL */}
      {aiModalOpen && (
        <div className="docs-ai-overlay" onClick={() => setAiModalOpen(false)}>
          <div className="docs-ai-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="docs-ai-header">
              <span className="ai-header-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polyline></svg>
                Ask Omma AI
              </span>
              <button type="button" className="btn-close-modal" onClick={() => setAiModalOpen(false)}>
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="docs-ai-chat-body">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`ai-chat-msg ${msg.role === "ai" ? "ai-msg" : "user-msg"}`}>
                  <div className={`ai-msg-avatar ${msg.role === "ai" ? "ai-icon" : "user-icon"}`}>
                    {msg.role === "ai" ? "🤖" : "U"}
                  </div>
                  <div className="ai-msg-bubble">
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="ai-chat-msg ai-msg">
                  <div className="ai-msg-avatar ai-icon">🤖</div>
                  <div className="ai-msg-bubble">
                    <div className="ai-typing-indicator">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <form className="docs-ai-input-bar" onSubmit={handleAskAISubmit}>
              <input
                type="text"
                className="docs-ai-input"
                placeholder="Ask about 3D grids, custom domains, upgrade..."
                value={aiInputValue}
                onChange={(e) => setAiInputValue(e.target.value)}
              />
              <button type="submit" className="btn-send-chat">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
