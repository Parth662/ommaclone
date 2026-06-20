const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  fullName: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "", // optional (users signing up via Google/OTP might not have a password set)
  },
  about: {
    type: String,
    default: "",
  },
  credits: {
    type: Number,
    default: 25,
  },
  chatCredits: {
    type: Number,
    default: 500,
  },
  projectCredits: {
    type: Number,
    default: 100,
  },
  settings: {
    smartRouting: { type: Boolean, default: false },
    webSearch: { type: Boolean, default: true },
    soundEffects: { type: Boolean, default: true },
    theme: { type: String, default: "dark" },
    fontSize: { type: String, default: "medium" },
    codeFont: { type: String, default: "System Mono" },
  },
  activityLogs: [
    {
      type: { type: String, required: true }, // e.g. 'generation', 'edit', 'upload', 'export', 'auth'
      action: { type: String, required: true },
      details: { type: String, default: "" },
      timestamp: { type: String, default: () => new Date().toLocaleString() },
      icon: { type: String, default: "⚡" },
    }
  ],
  loginLogs: [
    {
      time: { type: String, default: () => new Date().toLocaleString() },
      device: { type: String, default: "Unknown Device" },
      location: { type: String, default: "Mumbai, India" },
      ip: { type: String, default: "" },
      status: { type: String, default: "Success" },
      active: { type: Boolean, default: false },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("User", userSchema);
