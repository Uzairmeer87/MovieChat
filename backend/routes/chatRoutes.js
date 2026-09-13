const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatController");
const { getMovieDetails } = require("../controllers/movieController");

router.get("/", (_req, res) => {
  res.json({ status: "Movie Chatbot API is running 🎬", endpoints: ["POST /api/chat", "GET /api/movie/:id"] });
});
router.post("/chat", handleChat);
router.get("/movie/:id", getMovieDetails);

module.exports = router;
