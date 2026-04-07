/* ═══════════════════════════════════════════════════════════════
   MOVIE CHATBOT — CONSTANTS & MAPPINGS
   ═══════════════════════════════════════════════════════════════ */

/** TMDB genre-name → genre-id mapping */
const GENRE_MAP = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  "science fiction": 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

/** Mood keywords → genre ids (expanded with 20+ moods) */
const MOOD_MAP = {
  // Core moods
  happy: [35, 10751],           // comedy, family
  sad: [18, 10749],             // drama, romance
  scared: [27, 53],             // horror, thriller
  excited: [28, 878],           // action, sci-fi
  relaxed: [16, 35, 10751],    // animation, comedy, family
  romantic: [10749, 18],        // romance, drama
  adventurous: [12, 14],        // adventure, fantasy
  bored: [28, 35, 878],         // action, comedy, sci-fi

  // Expanded moods
  nostalgic: [18, 10751, 36],   // drama, family, history
  lonely: [18, 10749],          // drama, romance
  dark: [27, 80, 53],           // horror, crime, thriller
  inspirational: [18, 36],      // drama, history
  chill: [35, 16, 10751],       // comedy, animation, family
  intense: [28, 53, 80],        // action, thriller, crime
  "feel-good": [35, 10751, 10749], // comedy, family, romance
  thrilling: [53, 28, 80],      // thriller, action, crime
  heartwarming: [18, 10751, 10749], // drama, family, romance
  suspenseful: [53, 9648, 80],  // thriller, mystery, crime
  uplifting: [35, 18, 10751],   // comedy, drama, family
  melancholic: [18, 10749],     // drama, romance
  anxious: [53, 27, 9648],      // thriller, horror, mystery
  peaceful: [16, 10751, 99],    // animation, family, documentary
  energetic: [28, 12, 878],     // action, adventure, sci-fi
  curious: [99, 878, 9648],     // documentary, sci-fi, mystery
  angry: [28, 80, 53],          // action, crime, thriller
  dreamy: [14, 878, 16],        // fantasy, sci-fi, animation
  funny: [35, 16],              // comedy, animation
  scary: [27, 53],              // horror, thriller
  emotional: [18, 10749],       // drama, romance
  epic: [28, 12, 14],           // action, adventure, fantasy
  mysterious: [9648, 53, 80],   // mystery, thriller, crime
  futuristic: [878, 28],        // sci-fi, action
  historical: [36, 10752, 18],  // history, war, drama
  magical: [14, 16],            // fantasy, animation
  spooky: [27, 14],             // horror, fantasy
  cheerful: [35, 10751, 16],    // comedy, family, animation
  thoughtful: [18, 99],         // drama, documentary
  wild: [28, 12, 35],           // action, adventure, comedy
};

/**
 * Keyword → TMDB keyword IDs mapping.
 * Used for vague/thematic queries like "space", "robots", etc.
 * Multiple IDs per keyword to cast a wider net.
 */
const KEYWORD_MAP = {
  space: [1014, 4565],              // space, outer space
  robots: [9831, 9951],             // robot, artificial intelligence
  ai: [9951, 310],                  // artificial intelligence, technology
  zombies: [12377, 6152],           // zombie, undead
  aliens: [9882, 1014],             // alien, space
  vampires: [3133, 162846],         // vampire, vampires
  dragons: [11237, 14],             // dragon, fantasy
  pirates: [5765, 270],             // pirate, ocean
  ninjas: [1596, 779],              // ninja, martial arts
  samurai: [11479, 779],            // samurai, martial arts
  cowboys: [6027, 10195],           // cowboy, western
  heist: [10291, 15062],            // heist, robbery
  medieval: [161222, 177912],       // medieval, middle ages
  dystopian: [4458, 3801],          // dystopia, post-apocalyptic future
  apocalypse: [3801, 10685],        // post-apocalyptic, end of the world
  "time travel": [4379, 878],       // time travel
  dinosaurs: [5765, 155],           // dinosaur
  magic: [2343, 14],                // magic, fantasy
  supernatural: [9714, 6152],       // supernatural, ghost
  undercover: [5340, 15001],        // undercover, spy
  revenge: [9748, 4012],            // revenge, vigilante
  survival: [11442, 12339],         // survival, stranded
  ghosts: [6152, 9714],             // ghost, supernatural
  monsters: [9685, 4683],           // monster, creature
  superheroes: [9715, 180547],      // superhero, based on comic
  space: [1014, 4565],
  robots: [9831, 9951],
  ai: [9951, 310],
  "artificial intelligence": [9951, 310],
  zombies: [12377, 6152],
  zombie: [12377, 6152],
  aliens: [9882, 1014],
  alien: [9882, 1014],
  vampires: [3133, 162846],
  vampire: [3133, 162846],
  dragons: [11237, 14],
  pirates: [5765, 270],
  ninjas: [1596, 779],
  ninja: [1596, 779],
  samurai: [11479, 779],
  cowboys: [6027, 10195],
  heist: [10291, 15062],
  medieval: [161222, 177912],
  dystopian: [4458, 3801],
  dystopia: [4458, 3801],
  apocalypse: [3801, 10685],
  apocalyptic: [3801, 10685],
  "time travel": [4379, 878],
  "time traveling": [4379, 878],
  dinosaurs: [5765, 155],
  dinosaur: [5765, 155],
  magic: [2343, 14],
  supernatural: [9714, 6152],
  undercover: [5340, 15001],
  revenge: [9748, 4012],
  survival: [11442, 12339],
  ghosts: [6152, 9714],
  ghost: [6152, 9714],
  monsters: [9685, 4683],
  monster: [9685, 4683],
  superheroes: [9715, 180547],
  superhero: [9715, 180547],
  "serial killer": [10714, 80],
  hacking: [310, 9956],
  hacker: [310, 9956],
  demons: [6152, 15001],
  demon: [6152, 15001],
  martial: [779, 1596],
  "martial arts": [779, 1596],
  racing: [6503, 1399],
  spy: [5340, 6149],
  espionage: [5340, 6149],
  underwater: [270, 11442],
  prison: [10051, 15001],
  war: [10752, 14643],
  mafia: [10091, 80],
  gangster: [10091, 80],
  // New keywords
  "road trip": [1408, 12],
  "road movie": [1408, 12],
  "coming of age": [6066, 18],
  "growing up": [6066, 18],
  "true story": [11167, 18],
  "based on true story": [11167, 18],
  "based on book": [818, 18],
  "found footage": [10883, 27],
  mockumentary: [189402, 35],
  "buddy cop": [14263, 28],
  buddy: [14263, 35],
  "bank robbery": [10291, 80],
  cult: [6566, 9714],
  "cult classic": [6566, 18],
  mythology: [14699, 14],
  witch: [2343, 27],
  witches: [2343, 27],
  satire: [9826, 35],
  cyberpunk: [3233, 878],
  noir: [2964, 80],
  "film noir": [2964, 80],
  island: [270, 12],
  shipwreck: [270, 11442],
  pandemic: [3801, 27],
  virus: [3801, 27],
  werewolf: [3133, 27],
  werewolves: [3133, 27],
  ww2: [14643, 10752],
  "world war": [14643, 10752],
};

/** Language name → TMDB ISO code */
const LANGUAGE_MAP = {
  hindi: "hi",
  bollywood: "hi",
  korean: "ko",
  french: "fr",
  spanish: "es",
  japanese: "ja",
  chinese: "zh",
  italian: "it",
  german: "de",
  portuguese: "pt",
  arabic: "ar",
  russian: "ru",
  turkish: "tr",
  thai: "th",
  swedish: "sv",
};

/** Decade patterns → year range */
const DECADE_MAP = {
  "20s": { gte: "2020-01-01", lte: "2029-12-31" },
  "2020s": { gte: "2020-01-01", lte: "2029-12-31" },
  "10s": { gte: "2010-01-01", lte: "2019-12-31" },
  "2010s": { gte: "2010-01-01", lte: "2019-12-31" },
  "2000s": { gte: "2000-01-01", lte: "2009-12-31" },
  "00s": { gte: "2000-01-01", lte: "2009-12-31" },
  "90s": { gte: "1990-01-01", lte: "1999-12-31" },
  "1990s": { gte: "1990-01-01", lte: "1999-12-31" },
  "80s": { gte: "1980-01-01", lte: "1989-12-31" },
  "1980s": { gte: "1980-01-01", lte: "1989-12-31" },
  "70s": { gte: "1970-01-01", lte: "1979-12-31" },
  "1970s": { gte: "1970-01-01", lte: "1979-12-31" },
  "60s": { gte: "1960-01-01", lte: "1969-12-31" },
  "1960s": { gte: "1960-01-01", lte: "1969-12-31" },
  classic: { gte: "1940-01-01", lte: "1979-12-31" },
  classics: { gte: "1940-01-01", lte: "1979-12-31" },
  recent: { gte: "2020-01-01", lte: null },
  new: { gte: "2022-01-01", lte: null },
  latest: { gte: "2023-01-01", lte: null },
  old: { gte: "1940-01-01", lte: "1990-12-31" },
};

const GREETINGS = ["hi", "hello", "hey", "howdy", "hola", "yo", "sup", "hii", "helo", "heya", "wassup", "whatsup"];

const BOT_MESSAGES = {
  greeting:
    "Hey there! 🎬 I'm your Movie Bot. Ask me things like:\n• \"Suggest a comedy\"\n• \"I'm in the mood for horror\"\n• \"Search for Inception\"\n• \"Movies by Tom Hanks\"\n• \"I feel happy\"\n• \"Movies about space\"\n• \"Something like Interstellar\"\n• \"90s action movies\"\n• \"Korean films\"\n• \"Directed by Nolan\"",
  unknown:
    "Hmm, I didn't quite get that 🤔. Try asking me to suggest a genre, search for a movie title, tell me your mood, or ask for movies from a specific decade!",
  error: "Oops! Something went wrong on my end. Please try again in a moment.",
  fallbackTrending: "Here are some movies you might enjoy! 🔥",
};

/** Labels for smart search result types (used in frontend) */
const SEARCH_TYPE_LABELS = {
  exact: "exact",
  corrected: "corrected",
  fuzzy: "fuzzy",
  phonetic: "phonetic",
  keyword_match: "keyword_match",
  recommendation: "recommendation",
  trending_fallback: "trending_fallback",
};

module.exports = { GENRE_MAP, MOOD_MAP, KEYWORD_MAP, LANGUAGE_MAP, DECADE_MAP, GREETINGS, BOT_MESSAGES, SEARCH_TYPE_LABELS };
