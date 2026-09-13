import { useState, useEffect } from "react";
import { getMovieDetails } from "../../services/api";
import { X, Star, Clock, Calendar, Bookmark, Play, Sparkles, User, Film } from "lucide-react";
import { getMovieImageUrl } from "../../utils/imageUtils";

export default function MovieModal({
  movieId,
  onClose,
  isInWatchlist,
  onToggleWatchlist,
  onFindSimilar,
}) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [backdropError, setBackdropError] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const [prevMovieId, setPrevMovieId] = useState(movieId);

  if (movieId !== prevMovieId) {
    setPrevMovieId(movieId);
    setLoading(true);
    setError(false);
    setBackdropError(false);
    setPosterError(false);
    setMovie(null);
  }

  useEffect(() => {
    if (!movieId) return;
    let isMounted = true;
    getMovieDetails(movieId)
      .then((data) => {
        if (isMounted) {
          setMovie(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function formatRuntime(mins) {
    if (!mins) return "N/A";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  if (!movieId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f1118] border border-white/10 shadow-2xl custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center rounded-full text-slate-300 hover:text-white bg-black/60 backdrop-blur-md border border-white/15 transition-all cursor-pointer hover:scale-105"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-400">Loading movie details...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center h-96 gap-3 text-slate-400">
            <span className="text-4xl">🎬</span>
            <p className="text-sm font-medium">Failed to load movie details.</p>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 underline cursor-pointer"
            >
              Close Modal
            </button>
          </div>
        )}

        {/* Movie Content */}
        {movie && !loading && !error && (
          <>
            {/* Backdrop Image Banner */}
            <div className="relative h-60 sm:h-72 md:h-80 overflow-hidden bg-slate-950">
              {getMovieImageUrl(movie.backdrop, "w1280") && !backdropError ? (
                <img
                  src={getMovieImageUrl(movie.backdrop, "w1280")}
                  alt={movie.title}
                  onError={() => setBackdropError(true)}
                  className="w-full h-full object-cover filter brightness-[0.7] saturate-[1.2]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-orange-950 via-slate-900 to-purple-950 flex items-center justify-center">
                  <Film className="w-16 h-16 text-white/10" />
                </div>
              )}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1118] via-[#0f1118]/50 to-transparent" />

              {/* Floating Poster & Title Row */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex items-end gap-4 z-10">
                {getMovieImageUrl(movie.poster || movie.backdrop) && !posterError && (
                  <div className="hidden sm:block shrink-0 w-24 h-36 rounded-xl overflow-hidden shadow-2xl border border-white/20 transform -rotate-1 bg-slate-900">
                    <img
                      src={getMovieImageUrl(movie.poster || movie.backdrop)}
                      alt={movie.title}
                      onError={() => setPosterError(true)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-outfit leading-tight drop-shadow-md">
                    {movie.title}
                  </h2>
                  {movie.tagline && (
                    <p className="text-xs sm:text-sm text-slate-300 italic mt-0.5">
                      "{movie.tagline}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Movie Body Details */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Meta Stats Row */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{movie.rating ? movie.rating.toFixed(1) : "N/A"}</span>
                </div>

                {movie.year && (
                  <div className="flex items-center gap-1 text-slate-300 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{movie.year}</span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center gap-1 text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}

                {/* Genre Pills */}
                {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 ml-auto">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onToggleWatchlist(movie)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    isInWatchlist
                      ? "bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-950/40"
                      : "bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isInWatchlist ? "fill-current" : ""}`} />
                  <span>{isInWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onFindSimilar?.(`Movies similar to ${movie.title}`);
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Find Similar Movies</span>
                </button>
              </div>

              {/* Synopsis Overview */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Overview
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {movie.overview || "No overview available for this movie."}
                </p>
              </div>

              {/* Crew Badges */}
              {Array.isArray(movie.crew) && movie.crew.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Crew
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.crew.map((c, idx) => (
                      <div
                        key={`${c.id}-${idx}`}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs"
                      >
                        <span className="text-white font-medium">{c.name}</span>
                        <span className="text-slate-400 ml-1">({c.job})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailer Embed */}
              {Array.isArray(movie.videos) && movie.videos.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-orange-400" />
                    <span>Official {movie.videos[0].type || "Trailer"}</span>
                  </h3>
                  <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10 shadow-xl bg-black">
                    <iframe
                      src={movie.videos[0].url}
                      title={movie.videos[0].name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Cast Grid */}
              {Array.isArray(movie.cast) && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Top Cast
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {movie.cast.slice(0, 6).map((c) => (
                      <div key={c.id} className="text-center group">
                        <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 border border-white/10 mb-1.5 group-hover:border-orange-500/40 transition-colors">
                          {c.profile ? (
                            <img
                              src={c.profile}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-white truncate">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {c.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
