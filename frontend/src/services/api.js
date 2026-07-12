import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://moviechat-backend.onrender.com/api").replace(/\/$/, "");

const client = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s — Render free-tier can take ~50s to wake up
  headers: { "Content-Type": "application/json" },
});

/**
 * Send a chat message to the backend and return { reply, movies, searchMeta }.
 */
export async function sendMessage(message) {
  const { data } = await client.post("/chat", { message });
  return data;
}


/**
 * Get full movie details (cast, crew, trailers) by TMDB movie ID.
 */
export async function getMovieDetails(movieId) {
  const { data } = await client.get(`/movie/${movieId}`);
  return data;
}
