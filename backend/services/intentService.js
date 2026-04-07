const { GENRE_MAP, MOOD_MAP, KEYWORD_MAP, LANGUAGE_MAP, DECADE_MAP, GREETINGS } = require("../utils/constants");
const { normalise, correctQuery } = require("./spellService");

/* ═══════════════════════════════════════════════════════════════
   INTENT DETECTION ENGINE
   Intents: greeting | genre | mood | actor | director | language |
            decade | keyword | recommendation | search | trending |
            top_rated | hidden_gems | unknown
   ═══════════════════════════════════════════════════════════════ */

/** Strip emojis from text */
function stripEmojis(str) {
  return str.replace(/[\u{1F600}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, "").trim();
}

/**
 * Detect a year filter from the text.
 * Returns { year } or null.
 */
function detectYear(text) {
  const yearMatch = text.match(/\b(19[5-9]\d|20[012]\d)\b/);
  if (yearMatch) return { year: yearMatch[1] };
  return null;
}

/**
 * Detect a decade filter from the text.
 * Returns decade range object or null.
 */
function detectDecade(text) {
  for (const [label, range] of Object.entries(DECADE_MAP)) {
    if (text.includes(label)) return range;
  }
  return null;
}

/**
 * Detect a language filter from the text.
 * Returns ISO language code or null.
 */
function detectLanguage(text) {
  for (const [lang, iso] of Object.entries(LANGUAGE_MAP)) {
    if (text.includes(lang)) return { lang, iso };
  }
  return null;
}

/**
 * Analyse the user message and return an intent object.
 * All matching is case-insensitive and trimmed.
 */
function detectIntent(message) {
  const text = stripEmojis(normalise(message));

  // 1. Greeting
  if (GREETINGS.some((g) => text === g || text.startsWith(g + " ") || text.startsWith(g + "!"))) {
    return { type: "greeting" };
  }

  // 2. Trending / popular
  if (/\b(trending|popular|what'?s hot|top movies|what to watch)\b/i.test(text)) {
    return { type: "trending" };
  }

  // 3. Top-rated / best movies / hidden gems
  if (/\b(top.?rated|best rated|highest rated|best movies|masterpiece|critically acclaimed)\b/i.test(text)) {
    const genreId = detectGenreInText(text);
    return { type: "top_rated", genreId };
  }
  if (/\b(hidden gems?|underrated|overlooked|lesser.?known)\b/i.test(text)) {
    return { type: "hidden_gems" };
  }

  // 4. Director search — "directed by X", "movies by director X", "Nolan films"
  const directorMatch = text.match(
    /(?:directed\s+by|director\s+(?:is\s+)?|films?\s+(?:of|by)\s+director\s+)(.+)/i
  );
  if (directorMatch) {
    const directorName = directorMatch[1].replace(/\b(movies?|films?|please|pls)\b/gi, "").trim();
    if (directorName.length > 1) {
      return { type: "director", directorName };
    }
  }

  // 5. Language search — "Korean movies", "Hindi films", "French cinema"
  const langResult = detectLanguage(text);
  if (langResult) {
    // Check if combined with a genre/mood
    const genreId = detectGenreInText(text);
    const decade = detectDecade(text);
    return { type: "language", lang: langResult.lang, iso: langResult.iso, genreId, decade };
  }

  // 6. Recommendation intent — "movies like X", "similar to X"
  const recPatterns = [
    /(?:movies?\s+like|films?\s+like|similar\s+to|something\s+like|anything\s+like|more\s+like)\s+(.+)/i,
    /(.+?)\s+(?:type\s+movies?|kind\s+of\s+movies?|vibes?)/i,
  ];
  for (const pattern of recPatterns) {
    const recMatch = text.match(pattern);
    if (recMatch) {
      const movieTitle = recMatch[1]
        .replace(/\b(movies?|films?|please|pls|the)\b/gi, "")
        .trim();
      if (movieTitle.length > 1) {
        return { type: "recommendation", movieTitle };
      }
    }
  }

  // 7. Explicit search ("search for <title>", "find <title>")
  const searchMatch = text.match(
    /(?:search\s+(?:for\s+)?|find\s+|look\s+up\s+|show\s+me\s+)(.+)/i
  );
  if (searchMatch) {
    let query = searchMatch[1].replace(/\b(movies?|films?)\\b/gi, "").trim();
    if (query.length > 1) {
      const kwKey = Object.keys(KEYWORD_MAP).find((k) => query.includes(k));
      if (kwKey) return { type: "keyword", keyword: kwKey, keywordIds: KEYWORD_MAP[kwKey] };
      return { type: "search", query };
    }
  }

  // 8. Decade + genre combo ("90s action", "80s horror", "recent thrillers")
  const decade = detectDecade(text);
  if (decade) {
    const genreId = detectGenreInText(text);
    const kwKey = Object.keys(KEYWORD_MAP).find((k) => text.includes(k));
    return {
      type: "decade",
      decade,
      genreId,
      keyword: kwKey || null,
      keywordIds: kwKey ? KEYWORD_MAP[kwKey] : null,
    };
  }

  // 9. Year filter ("movies from 2019", "2023 thrillers")
  const yearMatch = detectYear(text);
  if (yearMatch) {
    const genreId = detectGenreInText(text);
    return { type: "year", year: yearMatch.year, genreId };
  }

  // 10. Keyword / theme BEFORE actor search
  const aboutMatch = text.match(/(?:movies?\s+about|films?\s+about|about)\s+(.+)/i);
  if (aboutMatch) {
    const keyword = aboutMatch[1].replace(/\b(movies?|films?)\b/gi, "").trim();
    if (keyword.length > 1) {
      const kwKey = Object.keys(KEYWORD_MAP).find((k) => keyword.includes(k));
      if (kwKey) return { type: "keyword", keyword: kwKey, keywordIds: KEYWORD_MAP[kwKey] };
      return { type: "keyword", keyword, keywordIds: null };
    }
  }

  // 11. Actor search
  const actorPatterns = [
    /(?:movies?\s+by|movies?\s+with|movies?\s+starring|films?\s+by|films?\s+with|films?\s+starring)\s+(.+)/i,
    /(?:starring|acted\s+by)\\s+(.+)/i,
    /(.+?)(?:'s\s+movies?|'s\s+films?)/i,
  ];
  for (const pattern of actorPatterns) {
    const actorMatch = text.match(pattern);
    if (actorMatch) {
      const actorName = actorMatch[1].replace(/\b(movies?|films?|please|pls)\b/gi, "").trim();
      if (actorName.length > 1) {
        const kwKey = Object.keys(KEYWORD_MAP).find((k) => actorName === k || actorName.includes(k));
        if (kwKey) return { type: "keyword", keyword: kwKey, keywordIds: KEYWORD_MAP[kwKey] };
        return { type: "actor", actorName };
      }
    }
  }

  // 12. Standalone keyword check
  const { corrected: spellCorrectedText } = correctQuery(text);
  const moodCheckText = spellCorrectedText || text;

  for (const [keyword, ids] of Object.entries(KEYWORD_MAP)) {
    if (text === keyword || moodCheckText === keyword) {
      return { type: "keyword", keyword, keywordIds: ids };
    }
  }

  // 13. Mood detection
  for (const [mood, genreIds] of Object.entries(MOOD_MAP)) {
    const moodRegex = new RegExp(`\\b${mood.replace(/[-\s]/g, "[-\\s]?")}\\b`, "i");
    if (moodRegex.test(text) || moodRegex.test(moodCheckText)) {
      return { type: "mood", mood, genreIds };
    }
  }

  // 14. Genre detection
  for (const [genre, id] of Object.entries(GENRE_MAP)) {
    if (text.includes(genre) || moodCheckText.includes(genre)) {
      return { type: "genre", genre, genreId: id };
    }
  }

  // 15. Keyword substring check
  for (const [keyword, ids] of Object.entries(KEYWORD_MAP)) {
    if (text.includes(keyword) || moodCheckText.includes(keyword)) {
      return { type: "keyword", keyword, keywordIds: ids };
    }
  }

  // 16. Fallback — treat remaining as a title search
  if (text.length > 2) {
    return { type: "search", query: text };
  }

  return { type: "unknown" };
}

/** Helper: detect a genre ID from arbitrary text */
function detectGenreInText(text) {
  for (const [genre, id] of Object.entries(GENRE_MAP)) {
    if (text.includes(genre)) return id;
  }
  return null;
}

module.exports = { detectIntent };
