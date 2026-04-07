const dotenv = require("dotenv");
dotenv.config();

const tmdbApiKey = process.env.TMDB_API_KEY;

if (!tmdbApiKey || tmdbApiKey === "your_tmdb_api_key_here") {
  console.error("⛔ TMDB_API_KEY is missing or not set in .env file!");
  console.error("   Get a free key at https://www.themoviedb.org/settings/api");
  process.exit(1);
}

module.exports = {
  tmdbApiKey,
  port: process.env.PORT || 5000,
  tmdbBaseUrl: "https://api.themoviedb.org/3",
  tmdbImageBase: "https://image.tmdb.org/t/p/w500",
  requestTimeout: 10000, // 10 second timeout for TMDB requests
};
