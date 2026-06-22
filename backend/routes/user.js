const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

/**
 * @route   GET /user/profile
 * @desc    Get the current user's profile and settings.
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    
    let needsSave = false;
    if (user.credits === undefined) {
      user.credits = 25;
      needsSave = true;
    }
    if (user.dailyLimit === undefined) {
      user.dailyLimit = 25;
      needsSave = true;
    }
    if (!user.lastCreditsReset) {
      user.lastCreditsReset = new Date();
      needsSave = true;
    }

    // Check daily credits reset
    const now = new Date();
    const lastReset = new Date(user.lastCreditsReset);
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastResetMidnight = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate());
    
    if (nowMidnight.getTime() > lastResetMidnight.getTime()) {
      user.credits = user.dailyLimit || 25;
      user.lastCreditsReset = now;
      needsSave = true;
    }

    // Keep legacy fields consistent
    user.chatCredits = user.credits;
    user.projectCredits = user.credits;

    if (needsSave) {
      await user.save();
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in GET /user/profile:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve user profile." });
  }
});

/**
 * @route   PUT /user/profile
 * @desc    Update the current user's profile and settings.
 */
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { fullName, about, settings } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (fullName !== undefined) user.fullName = fullName.trim();
    if (about !== undefined) user.about = about;
    if (settings !== undefined) {
      user.settings = { ...user.settings, ...settings };
    }

    user.activityLogs.unshift({
      type: "edit",
      action: "Profile Updated",
      details: "Modified account configuration and preferences",
      timestamp: "Today, " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      icon: "⚙️"
    });
    
    if (user.activityLogs.length > 20) {
      user.activityLogs = user.activityLogs.slice(0, 20);
    }

    await user.save();
    return res.status(200).json({ success: true, message: "Profile updated successfully.", user });
  } catch (error) {
    console.error("Error in PUT /user/profile:", error);
    return res.status(500).json({ success: false, message: "Failed to update user profile." });
  }
});

/**
 * @route   POST /user/credits
 * @desc    Refill credits back to daily limit.
 */
router.post("/credits", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const limit = user.dailyLimit || 25;
    if (user.credits >= limit) {
      return res.status(400).json({ success: false, message: "Maximum daily limit already reached." });
    }

    user.credits = limit;
    user.chatCredits = limit;
    user.projectCredits = limit;

    user.activityLogs.unshift({
      type: "export",
      action: "Requested Credits",
      details: `Claimed free credit refill (${limit} daily credits)`,
      timestamp: "Today, " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      icon: "⚡"
    });

    if (user.activityLogs.length > 20) {
      user.activityLogs = user.activityLogs.slice(0, 20);
    }

    await user.save();
    return res.status(200).json({ 
      success: true, 
      credits: user.credits,
      dailyLimit: user.dailyLimit,
      chatCredits: user.credits,
      projectCredits: user.credits
    });
  } catch (error) {
    console.error("Error in POST /user/credits:", error);
    return res.status(500).json({ success: false, message: "Failed to add credits." });
  }
});

/**
 * @route   POST /user/deduct-credit
 * @desc    Deduct 1 credit for chat or project action from the daily balance.
 */
router.post("/deduct-credit", verifyToken, async (req, res) => {
  try {
    const { type } = req.body;
    if (type !== "chat" && type !== "project") {
      return res.status(400).json({ success: false, message: "Invalid credit type." });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.credits === undefined) user.credits = 25;
    if (user.dailyLimit === undefined) user.dailyLimit = 25;
    if (!user.lastCreditsReset) user.lastCreditsReset = new Date();

    // Check daily credits reset
    const now = new Date();
    const lastReset = new Date(user.lastCreditsReset);
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastResetMidnight = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate());
    
    if (nowMidnight.getTime() > lastResetMidnight.getTime()) {
      user.credits = user.dailyLimit || 25;
      user.lastCreditsReset = now;
    }

    if (user.credits < 1) {
      return res.status(403).json({ success: false, message: "Insufficient daily credits. Your limit resets tomorrow." });
    }

    user.credits -= 1;
    user.chatCredits = user.credits;
    user.projectCredits = user.credits;

    user.activityLogs.unshift({
      type: "generation",
      action: type === "chat" ? "Chat Message Sent" : "Project Generated",
      details: `Consumed 1 daily credit (${user.credits}/${user.dailyLimit} remaining)`,
      timestamp: "Today, " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      icon: type === "chat" ? "💬" : "⚡"
    });

    if (user.activityLogs.length > 20) {
      user.activityLogs = user.activityLogs.slice(0, 20);
    }

    await user.save();
    return res.status(200).json({
      success: true,
      credits: user.credits,
      dailyLimit: user.dailyLimit,
      chatCredits: user.credits,
      projectCredits: user.credits
    });
  } catch (error) {
    console.error("Error in POST /user/deduct-credit:", error);
    return res.status(500).json({ success: false, message: "Failed to deduct credit." });
  }
});

/**
 * @route   POST /user/activity
 * @desc    Log a new activity for the current user.
 */
router.post("/activity", verifyToken, async (req, res) => {
  try {
    const { type, action, details, icon } = req.body;
    if (!type || !action) {
      return res.status(400).json({ success: false, message: "Type and action are required." });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.activityLogs.unshift({
      type,
      action,
      details,
      icon,
      timestamp: "Today, " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    });

    if (user.activityLogs.length > 20) {
      user.activityLogs = user.activityLogs.slice(0, 20);
    }

    await user.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in POST /user/activity:", error);
    return res.status(500).json({ success: false, message: "Failed to log activity." });
  }
});

/**
 * @route   DELETE /user/account
 * @desc    Permanently delete user account.
 */
router.delete("/account", verifyToken, async (req, res) => {
  try {
    const result = await User.deleteOne({ email: req.user.email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error in DELETE /user/account:", error);
    return res.status(500).json({ success: false, message: "Failed to delete account." });
  }
});

/**
 * @route   POST /user/chat
 * @desc    Generate AI completion for chats using Llama 3.1 on NVIDIA NIM API.
 */
router.post("/chat", verifyToken, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Messages array is required." });
    }

    const systemPrompt = `You are Forge AI, an elite generative AI design assistant for Omma.
Your job is to generate full, working, interactive HTML/JS/CSS pages based on the user's prompt.
If the user requests a 3D scene, 3D building, shader, or WebGL, utilize Three.js.
CRITICAL FOR 3D SCENES:
1. Always load Three.js core first:
   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
2. If OrbitControls are needed, you MUST load the controls script immediately after:
   <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
3. Instantiate the controls in JavaScript as:
   const controls = new THREE.OrbitControls(camera, renderer.domElement);
Ensure all designs are visually stunning, with premium dark mode aesthetics, glow effects, gradients, and animations.
Always return the response in friendly conversational markdown.
CRITICAL: You MUST include the full generated HTML code within a standard \`\`\`html ... \`\`\` code block so the platform can parse and render it. Do not use placeholders. Write complete, functional code.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: apiMessages,
        temperature: 0.2,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("NVIDIA NIM API Error:", errText);
      return res.status(502).json({ success: false, message: "Failed to connect to NVIDIA NIM API." });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const reasoning = data.choices[0].message.reasoning_content || data.choices[0].message.reasoning || "";

    return res.status(200).json({ success: true, content, reasoning });
  } catch (error) {
    console.error("Error in POST /user/chat:", error);
    return res.status(500).json({ success: false, message: "Failed to generate AI response." });
  }
});

module.exports = router;
