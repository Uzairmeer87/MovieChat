const tmdb = require("../services/tmdbService");

/**
 * GET /api/movie/:id
 * Returns full movie details including cast, crew, and trailers.
 */
async function getMovieDetails(req, res) {
  try {
    const { id } = req.params;
    const movieId = parseInt(id, 10);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const details = await tmdb.getFullMovieDetails(movieId);

    if (!details) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.json(details);
  } catch (err) {
    console.error("Movie details error:", err);
    const { getFallbackMovieDetails } = require("../utils/fallbackMovies");
    const { id } = req.params;
    const movieId = parseInt(id, 10);
    return res.json(getFallbackMovieDetails(isNaN(movieId) ? 550 : movieId));
  }
}

module.exports = { getMovieDetails };
