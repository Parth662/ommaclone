const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

// Helper function to format time ago
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
}

/**
 * @route   GET /chats
 * @desc    Get all chats of the current user.
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const chats = await Chat.find({ user: user._id })
      .select("title favorite image createdAt updatedAt messages")
      .sort({ updatedAt: -1 });

    const formattedChats = chats.map(chat => ({
      id: chat._id,
      title: chat.title,
      favorite: chat.favorite,
      image: chat.image,
      timeAgo: formatTimeAgo(chat.updatedAt),
      messagesCount: chat.messages ? chat.messages.length : 0
    }));

    return res.status(200).json({ success: true, chats: formattedChats });
  } catch (error) {
    console.error("Error in GET /chats:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve chats.", error: error.message, stack: error.stack });
  }
});

/**
 * @route   GET /chats/:id
 * @desc    Get a single chat details.
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found." });
    }
    return res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Error in GET /chats/:id:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve chat details.", error: error.message, stack: error.stack });
  }
});

/**
 * @route   POST /chats
 * @desc    Create a new chat.
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, messages, image } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const newChat = new Chat({
      user: user._id,
      title: title || "New Experience",
      messages: messages || [],
      image: image || "/grimoire_3d_thumbnail.png"
    });

    await newChat.save();
    return res.status(201).json({ success: true, chat: newChat });
  } catch (error) {
    console.error("Error in POST /chats:", error);
    return res.status(500).json({ success: false, message: "Failed to create chat.", error: error.message, stack: error.stack });
  }
});

/**
 * @route   POST /chats/:id/messages
 * @desc    Add messages to a chat.
 */
router.post("/:id/messages", verifyToken, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Messages array is required." });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found." });
    }

    chat.messages.push(...messages);
    await chat.save();

    return res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Error in POST /chats/:id/messages:", error);
    return res.status(500).json({ success: false, message: "Failed to add messages.", error: error.message, stack: error.stack });
  }
});

/**
 * @route   PUT /chats/:id
 * @desc    Update chat details (favorite state or title).
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, favorite } = req.body;
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found." });
    }

    if (title !== undefined) chat.title = title;
    if (favorite !== undefined) chat.favorite = favorite;

    await chat.save();
    return res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Error in PUT /chats/:id:", error);
    return res.status(500).json({ success: false, message: "Failed to update chat.", error: error.message, stack: error.stack });
  }
});

/**
 * @route   DELETE /chats/:id
 * @desc    Delete a chat.
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const result = await Chat.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Chat not found." });
    }
    return res.status(200).json({ success: true, message: "Chat deleted successfully." });
  } catch (error) {
    console.error("Error in DELETE /chats/:id:", error);
    return res.status(500).json({ success: false, message: "Failed to delete chat.", error: error.message, stack: error.stack });
  }
});

module.exports = router;
