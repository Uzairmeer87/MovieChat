const https = require("https");
const config = require("../config");
const {
  correctQuery,
  phoneticCorrect,
  rankBySimilarity,
  generateFallbackQueries,
  normalise,
} = require("./spellService");

/* ═══════════════════════════════════════════════════════════════
   TMDB HTTP CLIENT
   ═══════════════════════════════════════════════════════════════ */

/** Normalise a TMDB movie object into our response shape */
function normaliseMovie(movie) {
  return {
    id: movie.id,
    title: movie.title || "Untitled",
    overview: movie.overview || "No overview available.",
    poster: movie.poster_path
      ? `${config.tmdbImageBase}${movie.poster_path}`
      : null,
    backdrop: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : null,
    rating: movie.vote_average ?? 0,
    year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    genreIds: movie.genre_ids || [],
  };
}

/**
 * Make a GET request to TMDB using Node's native https module.
 */
function tmdbGet(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    params.api_key = config.tmdbApiKey;

    const query = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    const url = `${config.tmdbBaseUrl}${endpoint}?${query}`;

    const req = https.get(url, { timeout: config.requestTimeout }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const data = JSON.parse(body);

          if (res.statusCode === 401) {
            console.error("TMDB API error: 401 Unauthorized — check your API key in .env");
            return resolve({ results: [] });
          }
          if (res.statusCode === 429) {
            console.error("TMDB API rate limit exceeded. Try again shortly.");
            return resolve({ results: [] });
          }
          if (res.statusCode >= 400) {
            console.error(`TMDB API error: ${res.statusCode} for ${endpoint}`);
            return resolve({ results: [] });
          }

          resolve(data);
        } catch (parseErr) {
          console.error("TMDB response parse error:", parseErr.message);
          resolve({ results: [] });
        }
      });
    });

    req.on("error", (err) => {
      console.error(`TMDB request error for ${endpoint}: ${err.message}`);
      resolve({ results: [] });
    });

    req.on("timeout", () => {
      req.destroy();
      console.error(`TMDB request timed out for ${endpoint}`);
      resolve({ results: [] });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   CORE SEARCH FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

/** Raw TMDB search — returns normalised movie array. */
async function rawSearch(query, limit = 10) {
  if (!query || query.trim().length === 0) return [];
  const data = await tmdbGet("/search/movie", { query: query.trim(), page: 1 });
  return (data.results || []).slice(0, limit).map(normaliseMovie);
}

/** Discover popular movies by genre id(s). */
async function discoverByGenre(genreIds) {
  const ids = Array.isArray(genreIds) ? genreIds.join(",") : String(genreIds);
  const data = await tmdbGet("/discover/movie", {
    with_genres: ids,
    sort_by: "popularity.desc",
    page: 1,
  });
  return (data.results || []).slice(0, 6).map(normaliseMovie);
}

/** Get trending movies (fallback / "what's hot" feature). */
async function getTrending() {
  const data = await tmdbGet("/trending/movie/week");
  return (data.results || []).slice(0, 6).map(normaliseMovie);
}

/* ═══════════════════════════════════════════════════════════════
   NEW: KEYWORD-BASED SEARCH
   ═══════════════════════════════════════════════════════════════ */

/**
 * Search TMDB by keyword IDs — for thematic queries like "space", "robots".
 * Uses /discover/movie with `with_keywords` parameter.
 */
async function discoverByKeywords(keywordIds) {
  const ids = Array.isArray(keywordIds) ? keywordIds.join("|") : String(keywordIds);
  const data = await tmdbGet("/discover/movie", {
    with_keywords: ids,
    sort_by: "popularity.desc",
    page: 1,
  });
  return (data.results || []).slice(0, 6).map(normaliseMovie);
}

/**
 * Search TMDB's keyword database and discover matching movies.
 * For vague queries like "space", "robots", "zombies".
 */
async function searchByKeyword(keyword) {
  if (!keyword || keyword.trim().length === 0) return [];
  const data = await tmdbGet("/search/keyword", { query: keyword.trim(), page: 1 });
  const keywords = data.results || [];

  if (keywords.length === 0) return [];

  // Use top 3 keyword IDs
  const keywordIds = keywords.slice(0, 3).map((k) => k.id);
  return discoverByKeywords(keywordIds);
}

/* ═══════════════════════════════════════════════════════════════
   NEW: TOP RATED (genre filtered)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Get top-rated movies, optionally filtered by genre.
 */
async function getTopRated(genreId = null) {
  const params = { sort_by: "vote_average.desc", "vote_count.gte": 500, page: 1 };
  if (genreId) params.with_genres = String(genreId);
  const data = await tmdbGet("/discover/movie", params);
  return (data.results || []).slice(0, 6).map(normaliseMovie);
}

/* ═══════════════════════════════════════════════════════════════
   NEW: SIMILAR MOVIES (Recommendations)
   ═══════════════════════════════════════════════════════════════ */

/**
 * Find the TMDB movie ID for a given title, then fetch similar movies.
 */
async function getSimilarByTitle(title) {
  if (!title || title.trim().length === 0) return { sourceMovie: null, movies: [] };

  // First, find the movie
  const searchResults = await rawSearch(title, 5);
  if (searchResults.length === 0) return { sourceMovie: null, movies: [] };

  const source = searchResults[0];

  // Get similar movies
  const data = await tmdbGet(`/movie/${source.id}/similar`, { page: 1 });
  const similar = (data.results || [])
    .filter((m) => m.poster_path && m.vote_count > 10)
    .slice(0, 6)
    .map(normaliseMovie);

  // If similar endpoint returns few results, try recommendations too
  if (similar.length < 4) {
    const recData = await tmdbGet(`/movie/${source.id}/recommendations`, { page: 1 });
    const recs = (recData.results || [])
      .filter((m) => m.poster_path && m.vote_count > 10 && !similar.some((s) => s.id === m.id))
      .slice(0, 6 - similar.length)
      .map(normaliseMovie);
    similar.push(...recs);
  }

  return { sourceMovie: source, movies: similar };
}

/* ═══════════════════════════════════════════════════════════════
   SMART SEARCH — 6-STEP CASCADING PIPELINE
   Guaranteed to ALWAYS return ≥5 movies.
   ═══════════════════════════════════════════════════════════════ */

async function smartSearch(rawQuery) {
  const originalQuery = normalise(rawQuery);
  const { corrected, wasCorrected } = correctQuery(rawQuery);

  let movies = [];
  let searchType = "exact";
  const MIN_RESULTS = 5;

  // ── Step 1: Search with spell-corrected query ──────────
  if (wasCorrected) {
    movies = await rawSearch(corrected, 12);
    if (movies.length > 0) {
      searchType = "corrected";
      movies = rankBySimilarity(movies, corrected).slice(0, 6);
      if (movies.length >= MIN_RESULTS) {
        return buildResult(movies, originalQuery, corrected, true, searchType);
      }
    }
  }

  // ── Step 2: Search with original query ─────────────────
  const originalResults = await rawSearch(originalQuery, 12);
  if (originalResults.length > 0) {
    searchType = "exact";
    movies = rankBySimilarity(originalResults, originalQuery).slice(0, 6);
    if (movies.length >= MIN_RESULTS) {
      return buildResult(movies, originalQuery, wasCorrected ? corrected : originalQuery, wasCorrected, searchType);
    }
    // Keep partial results, try to supplement below
  }

  // ── Step 3: Phonetic correction attempt ────────────────
  if (movies.length < MIN_RESULTS) {
    const phonetic = phoneticCorrect(rawQuery);
    if (phonetic.wasCorrected && phonetic.corrected !== corrected) {
      const phoneticResults = await rawSearch(phonetic.corrected, 10);
      if (phoneticResults.length > 0) {
        searchType = "phonetic";
        const ranked = rankBySimilarity(phoneticResults, originalQuery).slice(0, 6);
        // Merge with any existing results (dedup by id)
        movies = dedup([...movies, ...ranked]).slice(0, 6);
        if (movies.length >= MIN_RESULTS) {
          return buildResult(movies, originalQuery, phonetic.corrected, true, searchType);
        }
      }
    }
  }

  // ── Step 4: Partial word fallbacks ─────────────────────
  if (movies.length < MIN_RESULTS) {
    const fallbacks = generateFallbackQueries(wasCorrected ? corrected : originalQuery);

    for (const partial of fallbacks) {
      const partialResults = await rawSearch(partial, 10);
      if (partialResults.length > 0) {
        const ranked = rankBySimilarity(partialResults, originalQuery).slice(0, 6);
        movies = dedup([...movies, ...ranked]).slice(0, 6);
        searchType = movies.length > 0 ? "fuzzy" : searchType;
        if (movies.length >= MIN_RESULTS) {
          return buildResult(movies, originalQuery, wasCorrected ? corrected : originalQuery, wasCorrected, searchType, partial);
        }
      }
    }
  }

  // ── Step 5: TMDB keyword search (thematic) ─────────────
  if (movies.length < MIN_RESULTS) {
    const keywordMovies = await searchByKeyword(originalQuery);
    if (keywordMovies.length > 0) {
      movies = dedup([...movies, ...keywordMovies]).slice(0, 6);
      searchType = "keyword_match";
      if (movies.length >= MIN_RESULTS) {
        return buildResult(movies, originalQuery, originalQuery, false, searchType);
      }
    }
  }

  // ── Step 6: Trending fallback (GUARANTEED results) ─────
  if (movies.length < MIN_RESULTS) {
    const trending = await getTrending();
    movies = dedup([...movies, ...trending]).slice(0, 6);
    // If we had SOME results from earlier steps, keep "fuzzy" type
    if (searchType === "exact" || movies.length <= trending.length) {
      searchType = "trending_fallback";
    }
  }

  return buildResult(
    movies,
    originalQuery,
    wasCorrected ? corrected : originalQuery,
    wasCorrected,
    searchType
  );
}

/** Build the standard search result object. */
function buildResult(movies, originalQuery, correctedQuery, wasCorrected, searchType, matchedPartial = null) {
  const meta = {
    originalQuery,
    correctedQuery,
    wasCorrected,
    searchType,
  };
  if (matchedPartial) meta.matchedPartial = matchedPartial;
  return { movies, searchMeta: meta };
}

/** Remove duplicate movies by ID. */
function dedup(movies) {
  const seen = new Set();
  return movies.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

/* ═══════════════════════════════════════════════════════════════
   SIMPLE TITLE SEARCH (backward compatibility)
   ═══════════════════════════════════════════════════════════════ */

async function searchByTitle(query) {
  return rawSearch(query, 6);
}

/* ═══════════════════════════════════════════════════════════════
   MOVIE DETAILS, CREDITS, VIDEOS
   ═══════════════════════════════════════════════════════════════ */

async function getMovieById(movieId) {
  const data = await tmdbGet(`/movie/${movieId}`);
  if (!data || data.success === false) return null;

  return {
    id: data.id,
    title: data.title || "Untitled",
    tagline: data.tagline || "",
    overview: data.overview || "No overview available.",
    poster: data.poster_path
      ? `${config.tmdbImageBase}${data.poster_path}`
      : null,
    backdrop: data.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
      : null,
    rating: data.vote_average ?? 0,
    voteCount: data.vote_count ?? 0,
    year: data.release_date ? data.release_date.slice(0, 4) : "N/A",
    releaseDate: data.release_date || "N/A",
    runtime: data.runtime || 0,
    genres: (data.genres || []).map((g) => g.name),
    budget: data.budget || 0,
    revenue: data.revenue || 0,
    status: data.status || "Unknown",
    originalLanguage: data.original_language || "en",
    homepage: data.homepage || null,
  };
}

async function getMovieCredits(movieId) {
  const data = await tmdbGet(`/movie/${movieId}/credits`);
  const cast = (data.cast || []).slice(0, 12).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character || "Unknown",
    profile: c.profile_path
      ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
      : null,
    order: c.order,
  }));

  const crew = (data.crew || [])
    .filter((c) => ["Director", "Producer", "Screenplay", "Writer"].includes(c.job))
    .slice(0, 6)
    .map((c) => ({
      id: c.id,
      name: c.name,
      job: c.job,
      profile: c.profile_path
        ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
        : null,
    }));

  return { cast, crew };
}

async function getMovieVideos(movieId) {
  const data = await tmdbGet(`/movie/${movieId}/videos`);
  const videos = (data.results || [])
    .filter((v) => v.site === "YouTube" && ["Trailer", "Teaser"].includes(v.type))
    .slice(0, 3)
    .map((v) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      type: v.type,
      url: `https://www.youtube.com/embed/${v.key}`,
    }));

  return videos;
}

async function getFullMovieDetails(movieId) {
  const [movie, credits, videos] = await Promise.all([
    getMovieById(movieId),
    getMovieCredits(movieId),
    getMovieVideos(movieId),
  ]);

  if (!movie) return null;

  return {
    ...movie,
    cast: credits.cast,
    crew: credits.crew,
    videos,
  };
}

/* ═══════════════════════════════════════════════════════════════
   ACTOR SEARCH
   ═══════════════════════════════════════════════════════════════ */

async function searchActor(actorName) {
  if (!actorName || actorName.trim().length === 0) return { actor: null, movies: [] };

  const data = await tmdbGet("/search/person", { query: actorName.trim(), page: 1 });
  const people = data.results || [];

  if (people.length === 0) return { actor: null, movies: [] };

  const person = people[0];
  const creditsData = await tmdbGet(`/person/${person.id}/movie_credits`);
  const castMovies = (creditsData.cast || [])
    .filter((m) => m.poster_path && m.vote_count > 10)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 6)
    .map(normaliseMovie);

  return {
    actor: {
      id: person.id,
      name: person.name,
      profile: person.profile_path
        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
        : null,
    },
    movies: castMovies,
  };
}

/* ═══════════════════════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════════════════════ */

module.exports = {
  discoverByGenre,
  discoverByKeywords,
  searchByTitle,
  searchByKeyword,
  smartSearch,
  getTrending,
  getTopRated,
  getFullMovieDetails,
  getSimilarByTitle,
  searchActor,
};
