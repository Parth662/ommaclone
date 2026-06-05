export const CARDS_DATA = [
  { id: 1, title: "Synthra AI Cloud Platform", tags: ["tailwind", "canvas", "react"], author: "LokiSh", initials: "LS", cat: "ai", color: "thumb-purple", emoji: "☁️" },
  { id: 2, title: "Custom Herbalism Shop", tags: ["tailwind", "particles"], author: "Amadeu S", initials: "AS", cat: "landing", color: "thumb-teal", emoji: "🌿" },
  { id: 3, title: "Yash Verma Portfolio", tags: ["canvas", "animation"], author: "Yash Verma", initials: "YV", cat: "ui", color: "thumb-coral", emoji: "✦" },
  { id: 4, title: "Toporun 3D Trail Map", tags: ["three.js", "tailwind"], author: "Gabor P", initials: "GP", cat: "3d", color: "thumb-blue", emoji: "🌋" },
  { id: 5, title: "Noodles Splash Page", tags: ["three.js", "canvas"], author: "marco", initials: "MA", cat: "3d", color: "thumb-pink", emoji: "🍜" },
  { id: 6, title: "AI Business Dashboard", tags: ["animation", "dashboard"], author: "Ansh", initials: "AN", cat: "ai", color: "thumb-amber", emoji: "📊" },
  { id: 7, title: "Particle Physics Sim", tags: ["canvas", "shader", "glsl"], author: "DevUser", initials: "DU", cat: "shader", color: "thumb-purple", emoji: "⚛️" },
  { id: 8, title: "Retro Game Engine", tags: ["canvas", "game"], author: "retrodev", initials: "RD", cat: "game", color: "thumb-teal", emoji: "🎮" },
  { id: 9, title: "Stock Chart Realtime", tags: ["d3", "data"], author: "fintech_x", initials: "FX", cat: "data", color: "thumb-coral", emoji: "📈" },
  { id: 10, title: "Motion Typography", tags: ["gsap", "motion"], author: "typemaster", initials: "TM", cat: "motion", color: "thumb-blue", emoji: "✍️" },
  { id: 11, title: "Creative Agency Site", tags: ["tailwind", "landing"], author: "studio99", initials: "S9", cat: "creative", color: "thumb-pink", emoji: "🎭" },
  { id: 12, title: "Neural Net Visualizer", tags: ["three.js", "ai", "canvas"], author: "ml_vis", initials: "ML", cat: "ai", color: "thumb-amber", emoji: "🧠" },
];

export const COMP_DATA = [
  { name: "3D Scene", desc: "Interactive WebGL scenes with Three.js", icon: "🌀", bg: "rgba(123,110,246,0.15)" },
  { name: "Particle System", desc: "GPU-accelerated particle effects", icon: "🎇", bg: "rgba(94,234,212,0.12)" },
  { name: "Data Charts", desc: "Animated charts with D3.js", icon: "📊", bg: "rgba(245,166,35,0.12)" },
  { name: "Landing Page", desc: "Conversion-focused page layouts", icon: "🌐", bg: "rgba(62,207,142,0.12)" },
  { name: "GLSL Shader", desc: "Fragment and vertex shader art", icon: "⚙", bg: "rgba(240,106,106,0.12)" },
  { name: "UI Components", desc: "Tailwind-powered interface blocks", icon: "🎨", bg: "rgba(123,110,246,0.15)" },
  { name: "Game Engine", desc: "Canvas-based 2D game framework", icon: "🎮", bg: "rgba(94,234,212,0.12)" },
  { name: "Animation", desc: "CSS and JS motion sequences", icon: "✨", bg: "rgba(245,166,35,0.12)" },
  { name: "Dashboard", desc: "Data-rich admin panel layouts", icon: "🖥", bg: "rgba(62,207,142,0.12)" },
];

export const AI_RESPONSES = {
  "3d": "I'll build you a Three.js 3D scene with orbit controls, dynamic lighting, and smooth animations. Working on it now — this'll look incredible! 🌀",
  "dashboard": "Creating a full dashboard with live charts, metric cards, filterable tables, and a dark sidebar. Building it now! 📊",
  "landing": "Designing a conversion-focused landing page with a hero section, feature blocks, testimonials, and a CTA footer. Building! 🌐",
  "particle": "Spinning up a GPU-accelerated particle system using WebGL — thousands of particles, mouse interaction, and glow effects. 🎇",
  "shader": "Writing GLSL fragment shaders with animated noise, color transitions, and UV distortion. This is gonna be beautiful! ⚙",
  "game": "Building a canvas-based game engine with sprites, collision detection, and a game loop. Let's go! 🎮",
  "default": "Great idea! I'm analyzing your request and generating the perfect solution for you. Give me a moment to craft something exceptional. ✨",
};

export function getAIResponse(msg, attachments = []) {
  let baseResponse = "";
  const m = msg.toLowerCase();
  
  if (m.includes("3d") || m.includes("three") || m.includes("webgl")) {
    baseResponse = AI_RESPONSES["3d"];
  } else if (m.includes("dashboard") || m.includes("chart") || m.includes("data")) {
    baseResponse = AI_RESPONSES["dashboard"];
  } else if (m.includes("landing") || m.includes("page") || m.includes("site")) {
    baseResponse = AI_RESPONSES["landing"];
  } else if (m.includes("particle")) {
    baseResponse = AI_RESPONSES["particle"];
  } else if (m.includes("shader") || m.includes("glsl")) {
    baseResponse = AI_RESPONSES["shader"];
  } else if (m.includes("game")) {
    baseResponse = AI_RESPONSES["game"];
  } else {
    baseResponse = AI_RESPONSES["default"];
  }

  if (attachments && attachments.length > 0) {
    const listNames = attachments.map(a => `<strong>${a.name}</strong>`).join(", ");
    let analysisMsg = "";
    
    // Check main attachment types to make the text specific
    const hasPhoto = attachments.some(a => a.type === "photo");
    const hasDoc = attachments.some(a => a.type === "document");
    const hasUrl = attachments.some(a => a.type === "url");
    
    if (hasPhoto && hasDoc && hasUrl) {
      analysisMsg = `I've successfully received and analyzed your photo layouts, structured document data, and reference URLs: ${listNames}. Let's merge these assets into a single system!`;
    } else if (hasPhoto) {
      analysisMsg = `Analyzing your attached visual asset (${listNames}). I will extract its layout hierarchy, typography details, and color palette to craft a matching design concept.`;
    } else if (hasDoc) {
      analysisMsg = `I've parsed the structure of your uploaded document (${listNames}). I see key data points and system requirements that we can map directly to our layouts.`;
    } else if (hasUrl) {
      analysisMsg = `I've indexed the reference details from your attached link (${listNames}). Let's build your experience inspired by this resource.`;
    } else {
      analysisMsg = `I've received your attachments: ${listNames}. Scanning their design parameters now...`;
    }
    
    return `${analysisMsg}<br/><br/>Based on that: ${baseResponse}`;
  }

  return baseResponse;
}