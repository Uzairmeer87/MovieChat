const { GENRE_MAP, MOOD_MAP, KEYWORD_MAP, GREETINGS } = require("../utils/constants");
const { normalise, correctQuery } = require("./spellService");

/* ═══════════════════════════════════════════════════════════════
   INTENT DETECTION ENGINE
   Intents: greeting | genre | mood | actor | keyword | recommendation | search | trending | unknown
   ═══════════════════════════════════════════════════════════════ */

/** Strip emojis from text */
function stripEmojis(str) {
  return str.replace(/[\u{1F600}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, "").trim();
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
  if (/\b(trending|popular|what'?s hot|top movies|best movies|what to watch)\b/i.test(text)) {
    return { type: "trending" };
  }

  // 3. Recommendation intent — "movies like X", "similar to X", "something like X"
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

  // 4. Explicit search ("search for <title>", "find <title>")
  const searchMatch = text.match(
    /(?:search\s+(?:for\s+)?|find\s+|look\s+up\s+|show\s+me\s+)(.+)/i
  );
  if (searchMatch) {
    let query = searchMatch[1].replace(/\b(movies?|films?)\b/gi, "").trim();
    if (query.length > 1) {
      // Check if this is actually a keyword/theme (e.g., "show me zombies")
      const kwKey = Object.keys(KEYWORD_MAP).find((k) => query.includes(k));
      if (kwKey) {
        return { type: "keyword", keyword: kwKey, keywordIds: KEYWORD_MAP[kwKey] };
      }
      return { type: "search", query };
    }
  }

  // 5. Keyword/theme detection — BEFORE actor search!
  //    "movies about space", "films about zombies", "about robots"
  const aboutMatch = text.match(/(?:movies?\s+about|films?\s+about|about)\s+(.+)/i);
  if (aboutMatch) {
    const keyword = aboutMatch[1].replace(/\b(movies?|films?)\b/gi, "").trim();
    if (keyword.length > 1) {
      const kwKey = Object.keys(KEYWORD_MAP).find((k) => keyword.includes(k));
      if (kwKey) {
        return { type: "keyword", keyword: kwKey, keywordIds: KEYWORD_MAP[kwKey] };
      }
      // Unknown keyword — still treat as keyword search on TMDB
      return { type: "keyword", keyword, keywordIds: null };
    }
  }

  // 6. Actor search ("movies by Tom Hanks", "films with DiCaprio", "starring Keanu")
  const actorPatterns = [
    /(?:movies?\s+by|movies?\s+with|movies?\s+starring|films?\s+by|films?\s+with|films?\s+starring)\s+(.+)/i,
    /(?:starring|acted\s+by|directed\s+by)\s+(.+)/i,
    /(.+?)(?:'s\s+movies?|'s\s+films?)/i,
  ];

  for (const pattern of actorPatterns) {
    const actorMatch = text.match(pattern);
    if (actorMatch) {
      const actorName = actorMatch[1]
        .replace(/\b(movies?|films?|please|pls)\b/gi, "")
        .trim();
      if (actorName.length > 1) {
        // Make sure it's not a keyword masquerading as an actor
        const kwKey = Object.keys(KEYWORD_MAP).find((k) => actorName === k || actorName.includes(k));
        if (kwKey) {
          return { type: "keyword", keyword: kwKey, keywordIds: KEYWORD_MAP[kwKey] };
        }
        return { type: "actor", actorName };
      }
    }
  }

  // 7. Check KEYWORD_MAP for standalone keywords
  const { corrected: spellCorrectedText } = correctQuery(text);
  const moodCheckText = spellCorrectedText || text;

  for (const [keyword, ids] of Object.entries(KEYWORD_MAP)) {
    if (text === keyword || moodCheckText === keyword) {
      return { type: "keyword", keyword, keywordIds: ids };
    }
  }

  // 8. Mood detection (expanded — 30+ moods)
  for (const [mood, genreIds] of Object.entries(MOOD_MAP)) {
    const moodRegex = new RegExp(`\\b${mood.replace("-", "[-\\s]?")}\\b`, "i");
    if (moodRegex.test(text) || moodRegex.test(moodCheckText)) {
      return { type: "mood", mood, genreIds };
    }
  }

  // 9. Genre detection
  for (const [genre, id] of Object.entries(GENRE_MAP)) {
    if (text.includes(genre) || moodCheckText.includes(genre)) {
      return { type: "genre", genre, genreId: id };
    }
  }

  // 10. Check if the text contains a known keyword
  for (const [keyword, ids] of Object.entries(KEYWORD_MAP)) {
    if (text.includes(keyword) || moodCheckText.includes(keyword)) {
      return { type: "keyword", keyword, keywordIds: ids };
    }
  }

  // 11. Fallback — treat any remaining text as a title search
  if (text.length > 2) {
    return { type: "search", query: text };
  }

  return { type: "unknown" };
}

module.exports = { detectIntent };
