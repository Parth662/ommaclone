const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "ai", "system"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  reasoning: {
    type: String,
    default: "",
  },
  attachments: [
    {
      id: { type: String },
      name: { type: String },
      type: { type: String }, // 'photo', 'document', 'url'
      url: { type: String },
      size: { type: String },
    }
  ],
  hasButton: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: "New Experience",
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "/grimoire_3d_thumbnail.png",
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
chatSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  if (typeof next === "function") {
    next();
  }
});

module.exports = mongoose.model("Chat", chatSchema);
