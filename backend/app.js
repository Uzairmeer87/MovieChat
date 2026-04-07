const express = require("express");
const cors = require("cors");
const config = require("./config");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(
  cors({
    // Allow all origins so your Vercel frontend can connect to your Render backend
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(express.json({ limit: "1mb" }));

// ── Routes ─────────────────────────────────────────────
app.use("/api", chatRoutes);

// Health check
app.get("/", (_req, res) =>
  res.json({ status: "Movie Chatbot API is running 🎬", uptime: process.uptime() })
);

// ── 404 handler ────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ── Global error handler ──────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ reply: "Internal server error", movies: [] });
});

// ── Start ──────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  console.log(`   TMDB API key: ${config.tmdbApiKey.slice(0, 6)}...✓`);
});
