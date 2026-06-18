require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const Otp = require("./models/Otp");
const { sendVerificationEmail } = require("./config/nodemailer");

// ── NEW: Razorpay payment router ──────────────────────────────────────────────
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Helper Regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ success: true, message: "OMMA Auth API is running." });
});

// ── NEW: Mount payment routes ─────────────────────────────────────────────────
app.use("/api/payment", paymentRoutes);

/**
 * @route   POST /send-otp
 */
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    const cleanEmail = email.trim().toLowerCase();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email: cleanEmail });

    const otpDoc = new Otp({
      email: cleanEmail,
      otp,
      createdAt: new Date(),
    });
    await otpDoc.save();

    const emailResult = await sendVerificationEmail(cleanEmail, otp);

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
      simulated: !!emailResult.simulated,
    });

  } catch (error) {
    console.error("Error in /send-otp route:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification code. Please try again later.",
      details: error.message,
    });
  }
});

/**
 * @route   POST /verify-otp
 */
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    const record = await Otp.findOne({ email: cleanEmail });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: "Incorrect verification code." });
    }

    await Otp.deleteOne({ _id: record._id });

    const token = jwt.sign(
      { email: cleanEmail },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Authentication successful.",
      token,
      email: cleanEmail,
    });

  } catch (error) {
    console.error("Error in /verify-otp route:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during verification.",
      details: error.message,
    });
  }
});

/**
 * @route   POST /google-login
 */
app.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: "Firebase ID token is required." });
    }

    const decoded = jwt.decode(idToken);
    if (!decoded) {
      return res.status(400).json({ success: false, message: "Invalid ID token format." });
    }

    const email = decoded.email;
    if (!email) {
      return res.status(400).json({ success: false, message: "Token email claim is missing." });
    }

    console.log(`[Firebase Auth] Google login request for: ${email}`);

    const token = jwt.sign(
      { email: email.toLowerCase() },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      token,
      email: email.toLowerCase(),
    });

  } catch (error) {
    console.error("Error in /google-login route:", error);
    return res.status(500).json({
      success: false,
      message: "Google Authentication failed.",
      details: error.message,
    });
  }
});

// Middleware: verifyToken
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
  }
};

// Protected endpoint
app.get("/me", verifyToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: "Successfully accessed protected route",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});