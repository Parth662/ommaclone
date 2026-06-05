import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import ChatView from "./components/ChatView.jsx";
import UpgradeModal from "./components/UpgradeModal.jsx";
import Landing from "./pages/Landing.jsx";
import Discover from "./pages/Discover.jsx";
import MyChats from "./pages/mychats.jsx";
import Community from "./pages/Community.jsx";
import Components from "./pages/Components.jsx";
import Search from "./pages/Search.jsx";
import { CARDS_DATA } from "./data/data.js";

const PAGE_TITLES = {
  discover: "Discover",
  landing: "Landing",
  community: "Community",
  components: "Components",
  search: "Search",
  chats: "My Chats",
  chat: "Chat",
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

export default function App() {
  const [activePage, setActivePage] = useState("landing");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleOpenChat = (context, initialPrompt) => {
    const msgs = buildInitialChatMessages(context);
    if (initialPrompt) {
      msgs.push({ role: "user", text: initialPrompt });
    }
    setChatMessages(msgs);
    setChatOpen(true);
  };

  const handleNavigate = (page) => {
    setChatOpen(false);
    setActivePage(page);
  };

  const handleBack = () => {
    setChatOpen(false);
    if (activePage === "chats") {
      setActivePage("chats");
    } else {
      setActivePage("discover");
    }
  };

  const currentTitle = chatOpen ? PAGE_TITLES.chat : PAGE_TITLES[activePage] || "Discover";

  if (activePage === "landing" && !chatOpen) {
    return <Landing onBack={() => handleNavigate("discover")} />;
  }

  return (
    <>
      <Sidebar
        activePage={chatOpen ? "chat" : activePage}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onUpgrade={() => setShowUpgrade(true)}
      />
      <div className="main">
        {(!chatOpen && activePage === "chats") ? null : (
          <Topbar
            title={currentTitle}
            onUpgrade={() => setShowUpgrade(true)}
          />
        )}

        {chatOpen ? (
          <ChatView
            initialMessages={chatMessages}
            onBack={handleBack}
          />
        ) : (
          <>
            {activePage === "discover" && (
              <Discover
                onOpenChat={handleOpenChat}
                onNavigateCommunity={() => handleNavigate("community")}
              />
            )}
            {activePage === "chats" && (
              <MyChats onOpenChat={handleOpenChat} />
            )}
            {activePage === "community" && (
              <Community onOpenChat={handleOpenChat} />
            )}
            {activePage === "components" && (
              <Components onOpenChat={handleOpenChat} />
            )}
            {activePage === "search" && (
              <Search onOpenChat={handleOpenChat} />
            )}
          </>
        )}
      </div>

      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}
    </>
  );
}