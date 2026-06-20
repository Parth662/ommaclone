require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const chatsRoutes = require("./routes/chats");

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ success: true, message: "OMMA Auth API is running." });
});

// Mount Routes
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/chats", chatsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
