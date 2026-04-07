const { detectIntent } = require("../services/intentService");
const tmdb = require("../services/tmdbService");
const { BOT_MESSAGES } = require("../utils/constants");

/* ═══════════════════════════════════════════════════════════════
   SMART REPLY BUILDER
   ═══════════════════════════════════════════════════════════════ */

function buildSearchReply(searchMeta) {
  const { originalQuery, correctedQuery, wasCorrected, searchType } = searchMeta;

  switch (searchType) {
    case "corrected":
      return `Showing results for "${correctedQuery}" (you searched: "${originalQuery}") ✨🔍`;

    case "phonetic":
      return `Did you mean "${correctedQuery}"? Here's what I found 🔎✨`;

    case "fuzzy":
      return `No exact match for "${originalQuery}", showing similar results 🔎`;

    case "keyword_match":
      return `Here are movies matching "${originalQuery}" 🎯`;

    case "recommendation":
      return `Movies similar to your search 🎬✨`;

    case "trending_fallback":
      return `I couldn't find a match for "${originalQuery}", but here are some trending movies you might enjoy! 🔥`;

    case "exact":
    default:
      if (wasCorrected && correctedQuery !== originalQuery) {
        return `Here's what I found for "${correctedQuery}" 🔍`;
      }
      return `Here's what I found for "${originalQuery}" 🔍`;
  }
}

/* ═══════════════════════════════════════════════════════════════
   CHAT HANDLER — NEVER returns empty movies[]
   ═══════════════════════════════════════════════════════════════ */

async function handleChat(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ reply: "Please send a message.", movies: [] });
    }

    const intent = detectIntent(message);

    let reply = "";
    let movies = [];
    let searchMeta = null;

    switch (intent.type) {
      case "greeting":
        reply = BOT_MESSAGES.greeting;
        break;

      case "genre":
        movies = await tmdb.discoverByGenre(intent.genreId);
        reply = movies.length
          ? `Here are some popular ${intent.genre} movies for you! 🎬`
          : BOT_MESSAGES.fallbackTrending;
        // Never-empty guarantee
        if (movies.length === 0) {
          movies = await tmdb.getTrending();
        }
        break;

      case "mood":
        movies = await tmdb.discoverByGenre(intent.genreIds);
        reply = movies.length
          ? `Since you're feeling ${intent.mood}, here are some movies you might enjoy! 🍿`
          : BOT_MESSAGES.fallbackTrending;
        if (movies.length === 0) {
          movies = await tmdb.getTrending();
        }
        break;

      case "actor": {
        const actorResult = await tmdb.searchActor(intent.actorName);
        movies = actorResult.movies;
        if (actorResult.actor && movies.length > 0) {
          reply = `Here are popular movies featuring ${actorResult.actor.name}! 🌟`;
        } else {
          // Fallback: try as a title search, then trending
          const searchResult = await tmdb.smartSearch(intent.actorName);
          movies = searchResult.movies;
          searchMeta = searchResult.searchMeta;
          reply = movies.length
            ? `I couldn't find an actor named "${intent.actorName}", but here are some related movies 🔎`
            : BOT_MESSAGES.fallbackTrending;
          if (movies.length === 0) {
            movies = await tmdb.getTrending();
          }
        }
        break;
      }

      case "keyword": {
        // Theme-based search (space, zombies, robots, etc.)
        if (intent.keywordIds) {
          movies = await tmdb.discoverByKeywords(intent.keywordIds);
        }
        if (!movies || movies.length === 0) {
          movies = await tmdb.searchByKeyword(intent.keyword);
        }
        if (movies.length > 0) {
          reply = `Here are movies about "${intent.keyword}" 🎯🎬`;
        } else {
          // Fallback to regular search, then trending
          const searchResult = await tmdb.smartSearch(intent.keyword);
          movies = searchResult.movies;
          searchMeta = searchResult.searchMeta;
          reply = movies.length
            ? buildSearchReply(searchResult.searchMeta)
            : BOT_MESSAGES.fallbackTrending;
          if (movies.length === 0) {
            movies = await tmdb.getTrending();
          }
        }
        break;
      }

      case "recommendation": {
        const recResult = await tmdb.getSimilarByTitle(intent.movieTitle);
        movies = recResult.movies;
        if (recResult.sourceMovie && movies.length > 0) {
          reply = `If you liked "${recResult.sourceMovie.title}", you'll love these! ✨🎬`;
          searchMeta = {
            originalQuery: intent.movieTitle,
            correctedQuery: recResult.sourceMovie.title,
            wasCorrected: false,
            searchType: "recommendation",
          };
        } else {
          // Fallback: try smart search
          const searchResult = await tmdb.smartSearch(intent.movieTitle);
          movies = searchResult.movies;
          searchMeta = searchResult.searchMeta;
          reply = movies.length
            ? `I couldn't find an exact match, but here are some results for "${intent.movieTitle}" 🔎`
            : BOT_MESSAGES.fallbackTrending;
          if (movies.length === 0) {
            movies = await tmdb.getTrending();
          }
        }
        break;
      }

      case "search": {
        const result = await tmdb.smartSearch(intent.query);
        movies = result.movies;
        searchMeta = result.searchMeta;
        reply = movies.length
          ? buildSearchReply(searchMeta)
          : BOT_MESSAGES.fallbackTrending;
        // smartSearch already guarantees results via trending fallback,
        // but double-check just in case
        if (movies.length === 0) {
          movies = await tmdb.getTrending();
        }
        break;
      }

      case "trending":
        movies = await tmdb.getTrending();
        reply = movies.length
          ? "Here are this week's trending movies! 🔥"
          : BOT_MESSAGES.fallbackTrending;
        break;

      default:
        // Even for unknown intents, show trending movies
        movies = await tmdb.getTrending();
        reply = movies.length
          ? BOT_MESSAGES.unknown + "\n\nHere's what's trending right now! 🔥"
          : BOT_MESSAGES.unknown;
    }

    return res.json({
      reply,
      movies,
      searchMeta: searchMeta || null,
    });
  } catch (err) {
    console.error("Chat handler error:", err);
    // Even on error, try to return trending movies
    try {
      const trendingMovies = await tmdb.getTrending();
      return res.status(200).json({
        reply: BOT_MESSAGES.error + "\n\nHere's what's trending while we fix things! 🔧🔥",
        movies: trendingMovies,
      });
    } catch {
      return res.status(500).json({ reply: BOT_MESSAGES.error, movies: [] });
    }
  }
}

module.exports = { handleChat };
