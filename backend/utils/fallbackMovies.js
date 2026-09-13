/* ═══════════════════════════════════════════════════════════════
   FALLBACK MOVIES DATASET
   High-quality offline movie database for seamless fallback when
   TMDB API is unreachable, timing out, or returning empty results.
   ═══════════════════════════════════════════════════════════════ */

const FALLBACK_MOVIES = [
  {
    id: 550,
    title: "Fight Club",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/hZkgoQY85KGWDODf2OiSYyA8lRI.jpg",
    rating: 8.4,
    voteCount: 27000,
    year: "1999",
    genreIds: [18, 53], // Drama, Thriller
    genres: ["Drama", "Thriller"],
    director: "David Fincher",
    actors: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    keywords: ["insomnia", "fight", "anti-establishment", "anarchy"],
    cast: [
      { id: 287, name: "Brad Pitt", character: "Tyler Durden", profile: "https://image.tmdb.org/t/p/w185/cckcYc2v0yh1tc9WFjSpjZ2jWv5.jpg" },
      { id: 819, name: "Edward Norton", character: "The Narrator", profile: "https://image.tmdb.org/t/p/w185/5XBz21xRILW0vYPPw123eMGIvIu.jpg" },
      { id: 1283, name: "Helena Bonham Carter", character: "Marla Singer", profile: "https://image.tmdb.org/t/p/w185/d875aI79f1p2xM02O315dG2Vl4.jpg" }
    ],
    crew: [
      { id: 7467, name: "David Fincher", job: "Director", profile: "https://image.tmdb.org/t/p/w185/iP444s11GkR6s0S6Lz1O7Lq6l5.jpg" }
    ],
    videos: [
      { id: "v1", key: "qtRKdV9dFEU", name: "Official Trailer", type: "Trailer", url: "https://www.youtube.com/embed/qtRKdV9dFEU" }
    ]
  },
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsX2P.jpg",
    rating: 8.4,
    voteCount: 33000,
    year: "2014",
    genreIds: [12, 18, 878], // Adventure, Drama, Sci-Fi
    genres: ["Adventure", "Drama", "Science Fiction"],
    director: "Christopher Nolan",
    actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    keywords: ["space", "wormhole", "time travel", "black hole", "father daughter"],
    cast: [
      { id: 10296, name: "Matthew McConaughey", character: "Cooper", profile: "https://image.tmdb.org/t/p/w185/eD2zZ2sN42hW6G6Q9z4zE2m1W8s.jpg" },
      { id: 1813, name: "Anne Hathaway", character: "Brand", profile: "https://image.tmdb.org/t/p/w185/2916l14sL06S0G2G8gS0gG2W0W2.jpg" },
      { id: 83002, name: "Jessica Chastain", character: "Murph", profile: "https://image.tmdb.org/t/p/w185/7786WlS2M4L2R1x0W11X2X0W0.jpg" }
    ],
    crew: [
      { id: 525, name: "Christopher Nolan", job: "Director", profile: "https://image.tmdb.org/t/p/w185/1xL45x9dM5W6z1W0v5X1M1L4L.jpg" }
    ],
    videos: [
      { id: "v2", key: "zSWdZVtXT7E", name: "Official Trailer", type: "Trailer", url: "https://www.youtube.com/embed/zSWdZVtXT7E" }
    ]
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Cobb, a skilled thief who steals corporate secrets through dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O.",
    poster: "https://image.tmdb.org/t/p/w500/oYiihBu1hR0zT2G2v2Vw5Tz33nN.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHA84.jpg",
    rating: 8.4,
    voteCount: 35000,
    year: "2010",
    genreIds: [28, 12, 878], // Action, Adventure, Sci-Fi
    genres: ["Action", "Adventure", "Science Fiction"],
    director: "Christopher Nolan",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    keywords: ["dream", "heist", "mind bending", "subconscious", "nolan"],
    cast: [
      { id: 6193, name: "Leonardo DiCaprio", character: "Dom Cobb", profile: "https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
      { id: 24045, name: "Joseph Gordon-Levitt", character: "Arthur", profile: "https://image.tmdb.org/t/p/w185/42T2sM02G1G2z3X4L00P0P1.jpg" },
      { id: 2524, name: "Tom Hardy", character: "Eames", profile: "https://image.tmdb.org/t/p/w185/yAcw02L2L20G0M2z3L0P0P1.jpg" }
    ],
    crew: [
      { id: 525, name: "Christopher Nolan", job: "Director", profile: "https://image.tmdb.org/t/p/w185/1xL45x9dM5W6z1W0v5X1M1L4L.jpg" }
    ],
    videos: [
      { id: "v3", key: "YoHD9XEInc0", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/YoHD9XEInc0" }
    ]
  },
  {
    id: 155,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/nMK28FiCj05T9pDF2q5zH1x0a1.jpg",
    rating: 8.5,
    voteCount: 31000,
    year: "2008",
    genreIds: [18, 28, 80, 53], // Drama, Action, Crime, Thriller
    genres: ["Drama", "Action", "Crime", "Thriller"],
    director: "Christopher Nolan",
    actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Gary Oldman"],
    keywords: ["batman", "joker", "superhero", "gotham", "dc"],
    cast: [
      { id: 3894, name: "Christian Bale", character: "Bruce Wayne / Batman", profile: "https://image.tmdb.org/t/p/w185/3894.jpg" },
      { id: 1810, name: "Heath Ledger", character: "Joker", profile: "https://image.tmdb.org/t/p/w185/1810.jpg" }
    ],
    crew: [
      { id: 525, name: "Christopher Nolan", job: "Director" }
    ],
    videos: [
      { id: "v4", key: "EXeTwQWrcwY", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/EXeTwQWrcwY" }
    ]
  },
  {
    id: 299536,
    title: "Avengers: Infinity War",
    overview: "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.",
    poster: "https://image.tmdb.org/t/p/w500/7WsyChLLEzcqIFv2VwMvyDhWSt.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/bOGkgRGdhrBYJSLpAYcqivLBY1.jpg",
    rating: 8.3,
    voteCount: 28000,
    year: "2018",
    genreIds: [12, 28, 878], // Adventure, Action, Sci-Fi
    genres: ["Adventure", "Action", "Science Fiction"],
    director: "Anthony Russo, Joe Russo",
    actors: ["Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo", "Chris Evans"],
    keywords: ["marvel", "avengers", "superhero", "thanos", "infinity stones"],
    cast: [
      { id: 3223, name: "Robert Downey Jr.", character: "Tony Stark / Iron Man", profile: "https://image.tmdb.org/t/p/w185/3223.jpg" },
      { id: 74568, name: "Chris Hemsworth", character: "Thor", profile: "https://image.tmdb.org/t/p/w185/74568.jpg" }
    ],
    crew: [
      { id: 19271, name: "Anthony Russo", job: "Director" }
    ],
    videos: [
      { id: "v5", key: "6ZfuNTqbHE8", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/6ZfuNTqbHE8" }
    ]
  },
  {
    id: 424783,
    title: "Spider-Man: Into the Spider-Verse",
    overview: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
    poster: "https://image.tmdb.org/t/p/w500/iiZZdoQHeeFGivAXm4RfoapvY82.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7d62ynXZ3cRKn2LbWeFiUtj3F91.jpg",
    rating: 8.4,
    voteCount: 15000,
    year: "2018",
    genreIds: [16, 28, 12, 878], // Animation, Action, Adventure, Sci-Fi
    genres: ["Animation", "Action", "Adventure", "Science Fiction"],
    director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    actors: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
    keywords: ["spiderman", "animation", "multiverse", "superhero"],
    cast: [
      { id: 1224150, name: "Shameik Moore", character: "Miles Morales", profile: "https://image.tmdb.org/t/p/w185/1224150.jpg" }
    ],
    crew: [
      { id: 1224151, name: "Bob Persichetti", job: "Director" }
    ],
    videos: [
      { id: "v6", key: "g4Hbz2jLxvQ", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/g4Hbz2jLxvQ" }
    ]
  },
  {
    id: 238,
    title: "The Godfather",
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone, barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers.",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiU.jpg",
    rating: 8.7,
    voteCount: 19000,
    year: "1972",
    genreIds: [18, 80], // Drama, Crime
    genres: ["Drama", "Crime"],
    director: "Francis Ford Coppola",
    actors: ["Marlon Brando", "Al Pacino", "James Caan"],
    keywords: ["mafia", "godfather", "crime family", "classic", "top rated"],
    cast: [
      { id: 3084, name: "Marlon Brando", character: "Don Vito Corleone" },
      { id: 1158, name: "Al Pacino", character: "Michael Corleone" }
    ],
    crew: [{ id: 1776, name: "Francis Ford Coppola", job: "Director" }],
    videos: [{ id: "v7", key: "sY1S34973zA", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/sY1S34973zA" }]
  },
  {
    id: 680,
    title: "Pulp Fiction",
    overview: "A burger-loving hitman, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in four tales of violence and redemption.",
    poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/suav2WGDVJftM3x3Cj1yP6OoqVo.jpg",
    rating: 8.5,
    voteCount: 26000,
    year: "1994",
    genreIds: [53, 80], // Thriller, Crime
    genres: ["Thriller", "Crime"],
    director: "Quentin Tarantino",
    actors: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
    keywords: ["tarantino", "crime", "hitman", "cult classic"],
    cast: [
      { id: 8891, name: "John Travolta", character: "Vincent Vega" },
      { id: 2231, name: "Samuel L. Jackson", character: "Jules Winnfield" }
    ],
    crew: [{ id: 138, name: "Quentin Tarantino", job: "Director" }],
    videos: [{ id: "v8", key: "s7EdQ4FqbhY", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/s7EdQ4FqbhY" }]
  },
  {
    id: 13,
    title: "Forrest Gump",
    overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events—each time, far exceeding what anyone imagined he could do.",
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9Ld1y0hha.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/3h1JZGDhZ8nzxdgvkxha09evqd.jpg",
    rating: 8.5,
    voteCount: 25000,
    year: "1994",
    genreIds: [35, 18, 10749], // Comedy, Drama, Romance
    genres: ["Comedy", "Drama", "Romance"],
    director: "Robert Zemeckis",
    actors: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    keywords: ["heartwarming", "feel-good", "tom hanks", "classic"],
    cast: [
      { id: 31, name: "Tom Hanks", character: "Forrest Gump" }
    ],
    crew: [{ id: 24, name: "Robert Zemeckis", job: "Director" }],
    videos: [{ id: "v9", key: "bLvqoHBptjg", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/bLvqoHBptjg" }]
  },
  {
    id: 129,
    title: "Spirited Away",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    poster: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLGWBZaV2d.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/ab2idFqWvhHhhwSg4gE2tV0lS0n.jpg",
    rating: 8.5,
    voteCount: 16000,
    year: "2001",
    genreIds: [16, 10751, 14], // Animation, Family, Fantasy
    genres: ["Animation", "Family", "Fantasy"],
    director: "Hayao Miyazaki",
    actors: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"],
    keywords: ["anime", "animation", "japanese", "miyazaki", "magical"],
    cast: [{ id: 19588, name: "Rumi Hiiragi", character: "Chihiro Ogino (voice)" }],
    crew: [{ id: 608, name: "Hayao Miyazaki", job: "Director" }],
    videos: [{ id: "v10", key: "ByXuk9QqQkk", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/ByXuk9QqQkk" }]
  },
  {
    id: 496243,
    title: "Parasite",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    poster: "https://image.tmdb.org/t/p/w500/7IiTqvZWmF12iZAeYYFDJxDffB7.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/hiKmpZMGZOSkA3W8u3kqDHY8Py8.jpg",
    rating: 8.5,
    voteCount: 17000,
    year: "2019",
    genreIds: [35, 18, 53], // Comedy, Drama, Thriller
    genres: ["Comedy", "Drama", "Thriller"],
    director: "Bong Joon-ho",
    actors: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    keywords: ["korean", "thriller", "oscar winner", "class struggle"],
    cast: [{ id: 2040, name: "Song Kang-ho", character: "Kim Ki-taek" }],
    crew: [{ id: 21684, name: "Bong Joon-ho", job: "Director" }],
    videos: [{ id: "v11", key: "5xH0HfJHsaY", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/5xH0HfJHsaY" }]
  },
  {
    id: 120,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    overview: "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home and embark on an epic quest to destroy it in the fires of Mount Doom.",
    poster: "https://image.tmdb.org/t/p/w500/6oom5WYQwhNvowTwwXAuvPJ5ozB.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/x2LSRK2Cm7M57Noz2W3v2R2n3.jpg",
    rating: 8.4,
    voteCount: 24000,
    year: "2001",
    genreIds: [12, 14, 28], // Adventure, Fantasy, Action
    genres: ["Adventure", "Fantasy", "Action"],
    director: "Peter Jackson",
    actors: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
    keywords: ["fantasy", "epic", "magic", "hobbit", "rings"],
    cast: [{ id: 109, name: "Elijah Wood", character: "Frodo Baggins" }],
    crew: [{ id: 108, name: "Peter Jackson", job: "Director" }],
    videos: [{ id: "v12", key: "V75dMMWJNpT", name: "Trailer", type: "Trailer", url: "https://www.youtube.com/embed/V75dMMWJNpT" }]
  }
];

/** Convert fallback movie format to standard API shape */
function getNormalizedFallbackMovies() {
  return FALLBACK_MOVIES.map((m) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster: m.poster,
    backdrop: m.backdrop,
    rating: m.rating,
    year: m.year,
    genreIds: m.genreIds,
  }));
}

/** Filter fallback movies by genre ID */
function getFallbackByGenre(genreId) {
  const normalized = getNormalizedFallbackMovies();
  if (!genreId) return normalized.slice(0, 6);
  const targetId = Number(genreId);
  const filtered = normalized.filter((m) => m.genreIds.includes(targetId));
  return filtered.length > 0 ? filtered.slice(0, 6) : normalized.slice(0, 6);
}

/** Search fallback movies by query term */
function searchFallbackMovies(query) {
  const q = (query || "").toLowerCase().trim();
  const normalized = getNormalizedFallbackMovies();
  if (!q) return normalized.slice(0, 6);

  const matched = FALLBACK_MOVIES.filter((m) => {
    const titleMatch = m.title.toLowerCase().includes(q);
    const overviewMatch = m.overview.toLowerCase().includes(q);
    const directorMatch = m.director.toLowerCase().includes(q);
    const actorMatch = m.actors.some((a) => a.toLowerCase().includes(q));
    const keywordMatch = m.keywords.some((k) => k.toLowerCase().includes(q));
    const genreMatch = m.genres.some((g) => g.toLowerCase().includes(q));
    return titleMatch || overviewMatch || directorMatch || actorMatch || keywordMatch || genreMatch;
  });

  const results = matched.length > 0 ? matched : FALLBACK_MOVIES;
  return results.slice(0, 6).map((m) => ({
    id: m.id,
    title: m.title,
    overview: m.overview,
    poster: m.poster,
    backdrop: m.backdrop,
    rating: m.rating,
    year: m.year,
    genreIds: m.genreIds,
  }));
}

/** Get fallback full movie details by ID */
function getFallbackMovieDetails(movieId) {
  const found = FALLBACK_MOVIES.find((m) => m.id === Number(movieId)) || FALLBACK_MOVIES[0];
  return {
    id: found.id,
    title: found.title,
    tagline: "An unforgettable movie experience.",
    overview: found.overview,
    poster: found.poster,
    backdrop: found.backdrop,
    rating: found.rating,
    voteCount: found.voteCount,
    year: found.year,
    releaseDate: `${found.year}-01-01`,
    runtime: 130,
    genres: found.genres,
    budget: 100000000,
    revenue: 400000000,
    status: "Released",
    originalLanguage: "en",
    homepage: null,
    cast: found.cast,
    crew: found.crew,
    videos: found.videos,
  };
}

module.exports = {
  FALLBACK_MOVIES,
  getNormalizedFallbackMovies,
  getFallbackByGenre,
  searchFallbackMovies,
  getFallbackMovieDetails,
};
