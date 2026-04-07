const { distance } = require("fastest-levenshtein");

/* ═══════════════════════════════════════════════════════════════
   COMMON MISSPELLING CORRECTIONS
   100+ movie-specific typo → correct mappings
   ═══════════════════════════════════════════════════════════════ */
const COMMON_CORRECTIONS = {
  // ── Genre typos ──────────────────────────────────────────
  moive: "movie", mvoie: "movie", movei: "movie", mvie: "movie",
  flim: "film", fillm: "film", flilm: "film",
  aciton: "action", acton: "action", actoin: "action", acion: "action",
  comdy: "comedy", commedy: "comedy", comedey: "comedy", comedi: "comedy",
  horrer: "horror", horor: "horror", horro: "horror", horar: "horror",
  roamnce: "romance", romace: "romance", romanc: "romance", roamntic: "romantic",
  thiller: "thriller", thriler: "thriller", thrillr: "thriller", triller: "thriller",
  scifi: "sci-fi", scfy: "sci-fi", scyfi: "sci-fi", syfi: "sci-fi",
  draama: "drama", drma: "drama", draam: "drama",
  animaton: "animation", animetion: "animation", animtion: "animation",
  documentry: "documentary", documentery: "documentary", documntary: "documentary",
  advnture: "adventure", adventur: "adventure", adventre: "adventure",
  fantsy: "fantasy", fantacy: "fantasy", fantaxy: "fantasy",
  mystry: "mystery", mistery: "mystery", mystrey: "mystery",
  westrn: "western", westen: "western", westerm: "western",

  // ── Popular movie title typos ────────────────────────────
  avnger: "avengers", avengrs: "avengers", avngers: "avengers", avengerr: "avengers",
  avengr: "avengers", avengrs: "avengers", avnger: "avengers", avanger: "avengers",
  batmn: "batman", baman: "batman", batmam: "batman", btman: "batman", batmna: "batman",
  supermn: "superman", suprman: "superman", supperman: "superman", supaman: "superman",
  spidrman: "spiderman", spdrman: "spiderman", spdierman: "spiderman",
  spidrmn: "spiderman", spidaman: "spiderman", siperman: "spiderman",
  ironman: "iron man", ironmn: "iron man",
  starwars: "star wars", starwar: "star wars", satrwars: "star wars",
  harrpotter: "harry potter", harrypotter: "harry potter", harrypottr: "harry potter",
  hary: "harry", pottr: "potter", pottter: "potter",
  incption: "inception", incepton: "inception", incpetion: "inception",
  inkeption: "inception", inceptoin: "inception", inceptin: "inception",
  interstllar: "interstellar", interstller: "interstellar", intersetllar: "interstellar",
  interstellr: "interstellar", insterstellar: "interstellar",
  titnic: "titanic", titenic: "titanic", titannc: "titanic",
  avatr: "avatar", avtar: "avatar", avater: "avatar",
  matrx: "matrix", matirx: "matrix", matix: "matrix", metrix: "matrix",
  jokr: "joker", jokre: "joker",
  gladiater: "gladiator", gladiator: "gladiator", gladitor: "gladiator",
  godfathr: "godfather", gofather: "godfather", godfahter: "godfather",
  froze: "frozen", frzen: "frozen",
  terminator: "terminator", termintor: "terminator", termnator: "terminator",
  tranformers: "transformers", transfomers: "transformers", trasnformers: "transformers",
  jurasic: "jurassic", jurassk: "jurassic", jurrasic: "jurassic",
  pirats: "pirates", pirtes: "pirates",
  deadpol: "deadpool", dedpool: "deadpool", dedpol: "deadpool",
  gardians: "guardians", gaurdians: "guardians", gurdians: "guardians",
  panther: "panther", panthr: "panther",
  captan: "captain", captian: "captain", captein: "captain",
  johnwick: "john wick", jonwick: "john wick", jhon: "john",

  // ── Common search word typos ─────────────────────────────
  serch: "search", sarch: "search", saerch: "search",
  recomend: "recommend", reccomend: "recommend", recomnd: "recommend",
  sugest: "suggest", suggets: "suggest", suggsst: "suggest",
  trnding: "trending", trendng: "trending",
  poplar: "popular", pupular: "popular", populer: "popular",
  latst: "latest", lates: "latest",
  scray: "scary", scairy: "scary", sacry: "scary",
  romanti: "romantic", romantc: "romantic",
  funy: "funny", funni: "funny", funyn: "funny",
  exiting: "exciting", excitting: "exciting",
  inspiraional: "inspirational", inspiratonal: "inspirational",
  nostaligc: "nostalgic", nostlagic: "nostalgic",

  // ── Actor name typos ─────────────────────────────────────
  dicaprio: "dicaprio", decaprio: "dicaprio", dicapro: "dicaprio",
  scarlet: "scarlett", scarltt: "scarlett",
  schwarznegger: "schwarzenegger", shwarzenegger: "schwarzenegger",
  stallone: "stallone", stalone: "stallone",
  downey: "downey", donwey: "downey",
};

/* ═══════════════════════════════════════════════════════════════
   SEARCH VOCABULARY — 150+ terms for fuzzy matching
   ═══════════════════════════════════════════════════════════════ */
const SEARCH_VOCABULARY = [
  // Genres
  "action", "adventure", "animation", "comedy", "crime", "documentary",
  "drama", "family", "fantasy", "history", "horror", "music", "mystery",
  "romance", "science fiction", "sci-fi", "thriller", "war", "western",

  // Common query words
  "movie", "movies", "film", "films", "show", "series", "search", "find",
  "suggest", "recommend", "trending", "popular", "best", "top", "new",
  "latest", "classic", "old", "funny", "scary", "romantic", "exciting",
  "similar", "like", "about", "starring", "directed", "featuring",

  // Moods & feelings
  "happy", "sad", "excited", "bored", "relaxed", "adventurous",
  "nostalgic", "lonely", "dark", "inspirational", "chill", "intense",
  "feel-good", "thrilling", "heartwarming", "suspenseful", "uplifting",
  "melancholic", "anxious", "peaceful", "energetic",

  // Keywords / themes
  "space", "robots", "zombies", "aliens", "dragons", "vampires",
  "pirates", "ninjas", "samurai", "cowboys", "heist", "medieval",
  "dystopian", "apocalypse", "time travel", "dinosaurs", "magic",
  "supernatural", "undercover", "revenge", "survival", "war",

  // Popular movies & franchises
  "avengers", "batman", "superman", "spiderman", "spider-man", "iron man",
  "star wars", "harry potter", "lord of the rings", "marvel", "dc",
  "inception", "interstellar", "titanic", "avatar", "matrix", "joker",
  "gladiator", "godfather", "dark knight", "frozen", "alien", "predator",
  "terminator", "transformers", "jurassic", "pirates", "mission impossible",
  "fast furious", "john wick", "deadpool", "guardians", "black panther",
  "doctor strange", "captain america", "wonder woman", "aquaman",
  "shawshank", "forrest gump", "pulp fiction", "fight club", "parasite",
  "whiplash", "dunkirk", "tenet", "oppenheimer", "barbie", "dune",
  "top gun", "maverick", "rocky", "rambo", "die hard", "lethal weapon",
  "blade runner", "mad max", "fury road", "the batman", "no way home",
  "endgame", "infinity war", "civil war", "ragnarok", "wakanda",
  "mandalorian", "rogue one", "jedi", "sith", "hobbit", "rings of power",
  "shang-chi", "eternals", "morbius", "venom",

  // Directors & actors
  "nolan", "spielberg", "scorsese", "tarantino", "kubrick", "fincher",
  "villeneuve", "anderson", "coppola", "hitchcock", "ridley scott",
  "dicaprio", "brad pitt", "tom hanks", "keanu", "denzel", "morgan freeman",
  "scarlett", "schwarzenegger", "stallone", "downey", "chris evans",
  "chris hemsworth", "robert downey", "samuel jackson", "will smith",
];

/* ═══════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

/** Normalise user input: trim + lowercase. */
function normalise(text) {
  return (text || "").toLowerCase().trim();
}

/** Fix known misspellings using the corrections dictionary. */
function fixKnownTypos(text) {
  const words = text.split(/\s+/);
  const corrected = words.map((w) => COMMON_CORRECTIONS[w] || w);
  return corrected.join(" ");
}

/* ─── Soundex Phonetic Matching ───────────────────────────── */

/**
 * Simple Soundex implementation for phonetic matching.
 * Encodes a word into a 4-character code based on how it sounds.
 */
function soundex(word) {
  if (!word || word.length === 0) return "";
  const w = word.toUpperCase();
  const map = {
    B: 1, F: 1, P: 1, V: 1,
    C: 2, G: 2, J: 2, K: 2, Q: 2, S: 2, X: 2, Z: 2,
    D: 3, T: 3,
    L: 4,
    M: 5, N: 5,
    R: 6,
  };

  let code = w[0];
  let lastCode = map[w[0]] || 0;

  for (let i = 1; i < w.length && code.length < 4; i++) {
    const c = map[w[i]] || 0;
    if (c && c !== lastCode) {
      code += c;
    }
    lastCode = c || lastCode;
    // Skip vowels/H/W but update lastCode only for mapped chars
    if (c === 0) lastCode = 0;
  }

  return (code + "000").slice(0, 4);
}

/**
 * Find phonetically similar words from vocabulary.
 */
function phoneticMatch(word, vocabulary) {
  if (word.length <= 2) return word;
  const targetSoundex = soundex(word);

  let bestMatch = word;
  let bestScore = Infinity;

  for (const candidate of vocabulary) {
    if (soundex(candidate) === targetSoundex) {
      const d = distance(word, candidate);
      if (d < bestScore) {
        bestScore = d;
        bestMatch = candidate;
      }
    }
  }

  // Only return phonetic match if it's reasonably close
  return bestScore <= 4 ? bestMatch : word;
}

/**
 * Attempt phonetic correction on entire query.
 */
function phoneticCorrect(query) {
  const words = normalise(query).split(/\s+/);
  const corrected = words.map((w) => {
    if (w.length <= 2) return w;
    return phoneticMatch(w, SEARCH_VOCABULARY);
  });
  const result = corrected.join(" ");
  return {
    corrected: result,
    wasCorrected: result !== normalise(query),
  };
}

/* ─── N-gram Similarity ──────────────────────────────────── */

/**
 * Generate character n-grams (bigrams by default) from a string.
 */
function ngrams(str, n = 2) {
  const s = normalise(str);
  const grams = new Set();
  for (let i = 0; i <= s.length - n; i++) {
    grams.add(s.substring(i, i + n));
  }
  return grams;
}

/**
 * Calculate n-gram similarity between two strings (0–1 scale).
 * 1 = identical, 0 = completely different.
 */
function ngramSimilarity(str1, str2, n = 2) {
  const grams1 = ngrams(str1, n);
  const grams2 = ngrams(str2, n);
  if (grams1.size === 0 || grams2.size === 0) return 0;

  let intersection = 0;
  for (const g of grams1) {
    if (grams2.has(g)) intersection++;
  }

  return (2 * intersection) / (grams1.size + grams2.size);
}

/* ─── Word-level Fuzzy Correction ────────────────────────── */

/**
 * Generate candidate corrections for a word by checking edit distance
 * against a vocabulary list. Returns best match if distance <= threshold.
 * Uses adaptive threshold: 2 for short words, 3 for 5+ char words.
 */
function suggestWord(word, vocabulary, baseThreshold = 2) {
  if (word.length <= 2) return word;

  // Adaptive threshold: longer words get more forgiveness
  const threshold = word.length >= 5 ? Math.min(baseThreshold + 1, 3) : baseThreshold;

  let best = word;
  let bestDist = Infinity;

  for (const candidate of vocabulary) {
    const d = distance(word, candidate);
    if (d < bestDist && d <= threshold) {
      bestDist = d;
      best = candidate;
    }
  }

  return best;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CORRECTION FUNCTION
   ═══════════════════════════════════════════════════════════════ */

/**
 * Attempt to correct a search query using multiple strategies:
 * 1. Normalise (lowercase + trim)
 * 2. Fix known typos from dictionary
 * 3. Fuzzy-match each word against vocabulary (adaptive threshold)
 * 4. Phonetic correction as backup
 *
 * Returns { original, corrected, wasCorrected }
 */
function correctQuery(rawQuery) {
  const original = normalise(rawQuery);

  // Step 1: Fix known typos
  let corrected = fixKnownTypos(original);

  // Step 2: Fuzzy-correct individual words against vocabulary
  const words = corrected.split(/\s+/);
  const fuzzyWords = words.map((w) => {
    if (w.length <= 2 || /^\d+$/.test(w)) return w;
    return suggestWord(w, SEARCH_VOCABULARY, 2);
  });
  corrected = fuzzyWords.join(" ");

  // Step 3: If still unchanged after steps 1-2, try phonetic matching
  if (corrected === original) {
    const phonetic = phoneticCorrect(original);
    if (phonetic.wasCorrected) {
      corrected = phonetic.corrected;
    }
  }

  return {
    original,
    corrected,
    wasCorrected: corrected !== original,
  };
}

/* ═══════════════════════════════════════════════════════════════
   RANKING & FALLBACK FUNCTIONS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Rank movie objects by how similar their titles are to the query.
 * Combines Levenshtein distance, contains bonus, starts-with bonus,
 * and n-gram similarity for best overall ranking.
 */
function rankBySimilarity(movies, query) {
  const q = normalise(query);

  return movies
    .map((movie) => {
      const title = normalise(movie.title || "");
      const dist = distance(q, title);
      const containsBonus = title.includes(q) ? -100 : 0;
      const startsWithBonus = title.startsWith(q) ? -200 : 0;
      const ngramBonus = ngramSimilarity(q, title) * -50;
      return { ...movie, _score: dist + containsBonus + startsWithBonus + ngramBonus };
    })
    .sort((a, b) => a._score - b._score)
    .map(({ _score, ...movie }) => movie);
}

/**
 * Generate partial query variants for fallback searching.
 * For "herp potter" → ["herp", "potter", "her", "pot"]
 */
function generateFallbackQueries(query) {
  const words = normalise(query).split(/\s+/).filter(Boolean);
  const variants = new Set();

  // Each individual word
  words.forEach((w) => {
    if (w.length > 2) variants.add(w);
  });

  // First 3–4 chars of each word (partial prefix)
  words.forEach((w) => {
    if (w.length >= 5) variants.add(w.slice(0, 4));
    else if (w.length >= 3) variants.add(w.slice(0, 3));
  });

  // Combined first word + second word (for multi-word queries)
  if (words.length >= 2) {
    variants.add(words.slice(0, 2).join(" "));
  }

  return [...variants];
}

/* ═══════════════════════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════════════════════ */
module.exports = {
  normalise,
  correctQuery,
  phoneticCorrect,
  rankBySimilarity,
  generateFallbackQueries,
  ngramSimilarity,
  soundex,
};
