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
  "serial killer": [10714, 80],     // serial killer, serial murder
  hacking: [310, 9956],             // technology, hacker
  demons: [6152, 15001],            // demon, hell
  martial: [779, 1596],             // martial arts, kung fu
  racing: [6503, 1399],             // race, car
  spy: [5340, 6149],                // spy, espionage
  underwater: [270, 11442],         // ocean, deep sea
  prison: [10051, 15001],           // prison, escape
  war: [10752, 14643],              // war, military
  mafia: [10091, 80],               // mafia, crime
  gangster: [10091, 80],            // gangster, organized crime
};

const GREETINGS = ["hi", "hello", "hey", "howdy", "hola", "yo", "sup", "hii", "helo", "heya", "wassup", "whatsup"];

const BOT_MESSAGES = {
  greeting:
    "Hey there! 🎬 I'm your Movie Bot. Ask me things like:\n• \"Suggest a comedy\"\n• \"I'm in the mood for horror\"\n• \"Search for Inception\"\n• \"Movies by Tom Hanks\"\n• \"I feel happy\"\n• \"Movies about space\"\n• \"Something like Interstellar\"",
  unknown:
    "Hmm, I didn't quite get that 🤔. Try asking me to suggest a genre, search for a movie title, or tell me your mood!",
  error: "Oops! Something went wrong on my end. Please try again in a moment.",
  // No more "noResults" — we ALWAYS return movies!
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

module.exports = { GENRE_MAP, MOOD_MAP, KEYWORD_MAP, GREETINGS, BOT_MESSAGES, SEARCH_TYPE_LABELS };
