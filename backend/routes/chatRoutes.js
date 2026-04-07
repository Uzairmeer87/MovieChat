const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatController");
const { getMovieDetails } = require("../controllers/movieController");

router.post("/chat", handleChat);
router.get("/movie/:id", getMovieDetails);

module.exports = router;
