import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Send a chat message to the backend and return { reply, movies, searchMeta }.
 * Retries once on network failure.
 */
export async function sendMessage(message) {
  try {
    const { data } = await client.post("/chat", { message });
    return data;
  } catch (err) {
    if (!err.response) {
      try {
        const { data } = await client.post("/chat", { message });
        return data;
      } catch {
        // still failed
      }
    }
    throw err;
  }
}

/**
 * Get full movie details (cast, crew, trailers) by TMDB movie ID.
 */
export async function getMovieDetails(movieId) {
  const { data } = await client.get(`/movie/${movieId}`);
  return data;
}
