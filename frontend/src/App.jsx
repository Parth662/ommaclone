import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import ChatView from "./components/ChatView.jsx";
import UpgradeModal from "./components/UpgradeModal.jsx";
import Landing from "./pages/Landing.jsx";
import Docs from "./pages/Docs.jsx";
import Discover from "./pages/Discover.jsx";
import MyChats from "./pages/mychats.jsx";
import Community from "./pages/Community.jsx";
import Components from "./pages/Components.jsx";
import Search from "./pages/Search.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import Trash from "./pages/Trash.jsx";
import CreateTeam from "./pages/CreateTeam.jsx";
import Notifications from "./pages/Notifications.jsx";
import { CARDS_DATA } from "./data/data.js";

const PAGE_TITLES = {
  discover: "Discover",
  landing: "Landing",
  community: "Community",
  components: "Components",
  search: "Search",
  chats: "My Chats",
  chat: "Chat",
  docs: "Documentation",
  login: "Login",
  signup: "Sign Up",
  profile: "My Profile",
  settings: "Settings",
  trash: "Trash",
  createteam: "Create Team",
  notifications: "Notifications",
};

function buildInitialChatMessages(context) {
  if (context === "new") {
    return [
      {
        role: "ai",
        text: "Hey! I'm Forge AI. Tell me what you want to build — a 3D scene, a landing page, a dashboard, a shader, or anything else. I'll generate it for you instantly. ⚡",
      },
    ];
  }
  if (context === "my" || context?.startsWith("recent")) {
    return [
      {
        role: "ai",
        text: "You don't have any recent chats yet. Start a new project to get going! 🚀",
      },
    ];
  }
  if (context === "grimoire") {
    return [
      {
        role: "ai",
        text: "Here is your <strong>Enchanted AI Grimoire 3D Experience</strong>. I added dynamic star particles, an interactive glowing spell pedestal, and a magic floating book mesh. Let me know what changes or spells you want to add! 🔮",
      },
    ];
  }
  if (context === "cyberpunk") {
    return [
      {
        role: "ai",
        text: "The <strong>Cyberpunk Landing Interface</strong> for 'THE INFINITE CANVAS' is fully constructed. It includes glowing holographic wave grids and custom interactive frames. What styling or copy updates should we make? 🌌",
      },
    ];
  }
  if (context === "modular") {
    return [
      {
        role: "ai",
        text: "Here is the <strong>Modular Asset Architecture</strong> dashboard mockup. It displays the central rotating wireframe box model in space. Would you like to add more modules or connect a data source? 📦",
      },
    ];
  }
  if (context?.startsWith("card-")) {
    const id = parseInt(context.replace("card-", ""));
    const card = CARDS_DATA.find((c) => c.id === id);
    if (card) {
      return [
        {
          role: "ai",
          text: `You're viewing <strong>${card.title}</strong>. Want me to explain how it was built, remix it with new features, or create something inspired by it?`,
        },
      ];
    }
  }
  if (context?.startsWith("remix-")) {
    const id = parseInt(context.replace("remix-", ""));
    const card = CARDS_DATA.find((c) => c.id === id);
    if (card) {
      return [
        {
          role: "ai",
          text: `Remixing <strong>${card.title}</strong>! What changes do you want to make? New colors, added features, different layout?`,
        },
      ];
    }
  }
  return [
    {
      role: "ai",
      text: "Let's build something awesome. What are you working on?",
    },
  ];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function App() {
  const [activePage, setActivePage] = useState("landing");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userEmail, setUserEmail] = useState("guest@omma.build");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [credits, setCredits] = useState({ chat: 500, project: 100 });
  const [activeChatId, setActiveChatId] = useState(null);

  const [recentChats, setRecentChats] = useState([]);

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${API_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const { chatCredits, projectCredits } = response.data.user;
        setCredits({
          chat: chatCredits !== undefined ? chatCredits : 500,
          project: projectCredits !== undefined ? projectCredits : 100
        });
      }
    } catch (err) {
      console.error("Error fetching credits:", err);
    }
  };

  const fetchRecentChats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${API_BASE_URL}/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRecentChats(response.data.chats.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching recent chats:", err);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    if (token && email) {
      setUserEmail(email);
      setActivePage("discover");
      fetchCredits();
      fetchRecentChats();
    }
  }, []);

  const handleOpenChat = async (context, initialPrompt, attachments = []) => {
    const isNewProject = context === "new" || context?.startsWith("remix-");
    const templates = ["new", "my", "grimoire", "cyberpunk", "modular"];
    const isTemplate = templates.includes(context) || context?.startsWith("recent") || context?.startsWith("card-") || context?.startsWith("remix-");

    if (isNewProject) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to generate projects.");
        return;
      }

      if (credits.project < 1) {
        setShowUpgrade(true);
        alert("You have run out of project credits! Please request a refill or upgrade your plan.");
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/user/deduct-credit`, { type: "project" }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setCredits({
            chat: response.data.chatCredits,
            project: response.data.projectCredits
          });
        } else {
          alert("Failed to consume project credit. Please check your connection.");
          return;
        }
      } catch (err) {
        console.error("Error deducting project credit:", err);
        const errMsg = err.response?.data?.message || "Failed to consume project credit.";
        if (err.response?.status === 403) {
          setShowUpgrade(true);
        }
        alert(errMsg);
        return;
      }

      // Create new chat in MongoDB
      try {
        const initialMsgs = buildInitialChatMessages(context);
        if (initialPrompt) {
          initialMsgs.push({ role: "user", text: initialPrompt, attachments });
        }

        let title = "New Project";
        if (initialPrompt) {
          title = initialPrompt.length > 30 ? initialPrompt.substring(0, 30) + "..." : initialPrompt;
        } else if (context?.startsWith("remix-")) {
          title = `Remix: ${context.replace("remix-", "")}`;
        }

        const images = ["/grimoire_3d_thumbnail.png", "/cyberpunk_canvas_thumbnail.png", "/modular_architecture_thumbnail.png"];
        const randomImage = images[Math.floor(Math.random() * images.length)];

        const createRes = await axios.post(`${API_BASE_URL}/chats`, {
          title,
          messages: initialMsgs,
          image: randomImage
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (createRes.data.success) {
          setChatMessages(createRes.data.chat.messages);
          setActiveChatId(createRes.data.chat._id);
          fetchRecentChats();
          setChatOpen(true);
          return;
        }
      } catch (err) {
        console.error("Error creating chat in database:", err, err.response?.data);
        alert("Failed to initialize chat session in database.");
        return;
      }
    }

    if (!isTemplate) {
      // Fetch existing chat from database
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/chats/${context}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setChatMessages(response.data.chat.messages);
          setActiveChatId(response.data.chat._id);
          setChatOpen(true);
          return;
        }
      } catch (err) {
        console.error("Error fetching chat details:", err);
        alert("Failed to load chat history.");
        return;
      }
    }

    // Default static template rendering
    const msgs = buildInitialChatMessages(context);
    if (initialPrompt) {
      msgs.push({ role: "user", text: initialPrompt, attachments });
    }
    setActiveChatId(null);
    setChatMessages(msgs);
    setChatOpen(true);
  };

  const handleUseChatCredit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await axios.post(`${API_BASE_URL}/user/deduct-credit`, { type: "chat" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCredits({
          chat: response.data.chatCredits,
          project: response.data.projectCredits
        });
        return true;
      }
    } catch (err) {
      console.error("Error deducting chat credit:", err);
    }
    return false;
  };

  const handleAppendMessages = async (newMsgs) => {
    if (!activeChatId) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API_BASE_URL}/chats/${activeChatId}/messages`, { messages: newMsgs }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Error saving messages to database:", err);
    }
  };

  const handleGenerateAIResponse = async (chatHistory) => {
    const token = localStorage.getItem("token");
    if (!token) return { content: "Please log in to chat.", reasoning: "" };
    try {
      const response = await axios.post(`${API_BASE_URL}/user/chat`, { messages: chatHistory }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        return {
          content: response.data.content,
          reasoning: response.data.reasoning || ""
        };
      }
    } catch (err) {
      console.error("Error generating AI response:", err);
    }
    return {
      content: "Failed to connect to Forge AI. Please check your connection.",
      reasoning: ""
    };
  };

  const handleNavigate = (page) => {
    setChatOpen(false);
    if (page === "login" || page === "landing") {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      setUserEmail("guest@omma.build");
      setCredits({ chat: 500, project: 100 });
      setActiveChatId(null);
    }
    setActivePage(page);
  };

  const handleBack = () => {
    setChatOpen(false);
    setActiveChatId(null);
    fetchRecentChats();
    if (activePage === "chats") {
      setActivePage("chats");
    } else {
      setActivePage("discover");
    }
  };

  const currentTitle = chatOpen ? PAGE_TITLES.chat : PAGE_TITLES[activePage] || "Discover";

  const isLoggedIn = !!localStorage.getItem("token");
  const publicPages = ["landing", "login", "signup", "docs"];

  // Auth Guard: Redirect to landing page if user is not authenticated and attempts to access private pages
  if (!isLoggedIn && !publicPages.includes(activePage)) {
    return (
      <Landing
        onNavigate={handleNavigate}
        onBack={() => handleNavigate("login")}
        onGetStarted={() => handleNavigate("signup")}
      />
    );
  }

  // ── Full-screen pages ────────────────────────────────────────────────────

  if (activePage === "landing" && !chatOpen) {
    return (
      <Landing
        onNavigate={handleNavigate}
        onBack={() => handleNavigate("login")}
        onGetStarted={() => handleNavigate("signup")}
      />
    );
  }

  if (activePage === "docs" && !chatOpen) {
    return <Docs onBack={() => handleNavigate(isLoggedIn ? "discover" : "landing")} />;
  }

  if (activePage === "login" && !chatOpen) {
    return (
      <Login
        onLoginSuccess={(email) => {
          setUserEmail(email);
          handleNavigate("discover");
          fetchCredits();
          fetchRecentChats();
        }}
        onBack={() => handleNavigate("landing")}
        onNavigateSignup={() => handleNavigate("signup")}
      />
    );
  }

  if (activePage === "signup" && !chatOpen) {
    return (
      <Signup
        onSignupSuccess={(email) => {
          setUserEmail(email || "guest@omma.build");
          handleNavigate("discover");
          fetchCredits();
          fetchRecentChats();
        }}
        onBack={() => handleNavigate("landing")}
        onNavigateLogin={() => handleNavigate("login")}
      />
    );
  }

  if (activePage === "profile" && !chatOpen) {
    return (
      <Profile
        userEmail={userEmail}
        chatCredits={credits.chat}
        projectCredits={credits.project}
        onCreditsRefilled={fetchCredits}
        onBack={() => handleNavigate("discover")}
      />
    );
  }

  // ── Dashboard shell ──────────────────────────────────────────────────────

  return (
    <>
      <Sidebar
        activePage={chatOpen ? "chat" : activePage}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        userEmail={userEmail}
        isPro={isPro}
        onUpgrade={() => setShowUpgrade(true)}
        chatCredits={credits.chat}
        projectCredits={credits.project}
        recentChats={recentChats}
      />
      <div className="main">
        {(!chatOpen && activePage === "chats") ? null : (
          <Topbar 
            title={currentTitle} 
            onUpgrade={() => setShowUpgrade(true)} 
            onNavigate={handleNavigate} 
            chatCredits={credits.chat}
            projectCredits={credits.project}
          />
        )}

        {chatOpen ? (
          <ChatView 
            initialMessages={chatMessages} 
            onBack={handleBack} 
            chatCredits={credits.chat}
            onUseChatCredit={handleUseChatCredit}
            activeChatId={activeChatId}
            onAppendMessages={handleAppendMessages}
            onGenerateAIResponse={handleGenerateAIResponse}
          />
        ) : (
          <>
            {activePage === "discover" && (
              <Discover
                onOpenChat={handleOpenChat}
                onNavigateCommunity={() => handleNavigate("community")}
              />
            )}
            {activePage === "chats" && <MyChats onOpenChat={handleOpenChat} />}
            {activePage === "community" && <Community onOpenChat={handleOpenChat} />}
            {activePage === "components" && <Components onOpenChat={handleOpenChat} />}
            {activePage === "search" && <Search onOpenChat={handleOpenChat} />}
            {activePage === "settings" && <Settings userEmail={userEmail} />}
            {activePage === "notifications" && <Notifications />}
            {activePage === "trash" && <Trash />}
            {activePage === "createteam" && (
              <CreateTeam
                userEmail={userEmail}
                isPro={isPro}
                onUpgrade={() => setShowUpgrade(true)}
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </div>

      {showUpgrade && (
        <UpgradeModal
          onClose={() => setShowUpgrade(false)}
          chatCredits={credits.chat}
          projectCredits={credits.project}
          onCreditsRefilled={fetchCredits}
          onUpgradeSuccess={() => {
            setIsPro(true);
            setShowUpgrade(false);
          }}
        />
      )}
    </>
  );
}