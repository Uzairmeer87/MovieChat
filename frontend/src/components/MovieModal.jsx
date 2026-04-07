import { useState, useEffect } from "react";
import { getMovieDetails } from "../services/api";

/**
 * MovieModal — full-screen overlay with movie details, cast, and trailers.
 *
 * Props:
 *   movieId        — TMDB movie ID to fetch details for
 *   onClose        — callback to close the modal
 *   isInWatchlist  — boolean
 *   onToggleWatchlist — callback(movie) to add/remove from watchlist
 */
export default function MovieModal({ movieId, onClose, isInWatchlist, onToggleWatchlist }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    setLoading(true);
    setError(false);

    getMovieDetails(movieId)
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [movieId]);

  // Close on Escape key
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function formatRuntime(mins) {
    if (!mins) return "N/A";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-content relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        {loading && (
          <div className="flex items-center justify-center h-80">
            <div className="loading-spinner" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <span className="text-4xl mb-3">😕</span>
            <p>Failed to load movie details</p>
            <button
              onClick={onClose}
              className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Go back
            </button>
          </div>
        )}

        {movie && !loading && !error && (
          <>
            {/* Hero section with backdrop */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
              {movie.backdrop ? (
                <img
                  src={movie.backdrop}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900" />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {movie.title}
                </h2>
                {movie.tagline && (
                  <p className="text-sm text-slate-300 italic">"{movie.tagline}"</p>
                )}
              </div>
            </div>

            {/* Movie info */}
            <div className="p-6 bg-slate-950/95">
              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  ★ {movie.rating.toFixed(1)}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 text-sm">{movie.year}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 text-sm">{formatRuntime(movie.runtime)}</span>
                {movie.genres.length > 0 && (
                  <>
                    <span className="text-slate-500">•</span>
                    <div className="flex flex-wrap gap-1.5">
                      {movie.genres.map((g) => (
                        <span
                          key={g}
                          className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Watchlist button */}
              <button
                onClick={() => onToggleWatchlist(movie)}
                className={`mb-5 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isInWatchlist
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500/50 hover:text-white"
                }`}
              >
                <span>{isInWatchlist ? "★" : "☆"}</span>
                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </button>

              {/* Overview */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {movie.overview}
              </p>

              {/* Crew */}
              {movie.crew && movie.crew.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-2">Crew</h3>
                  <div className="flex flex-wrap gap-3">
                    {movie.crew.map((c, i) => (
                      <div key={`${c.id}-${i}`} className="text-xs text-slate-400">
                        <span className="text-slate-200">{c.name}</span>
                        <span className="text-slate-500 ml-1">({c.job})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailer */}
              {movie.videos && movie.videos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    🎬 {movie.videos[0].type === "Teaser" ? "Teaser" : "Trailer"}
                  </h3>
                  <div className="relative rounded-xl overflow-hidden aspect-video border border-white/10">
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

              {/* Cast */}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Cast</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {movie.cast.map((c) => (
                      <div key={c.id} className="text-center group">
                        {c.profile ? (
                          <img
                            src={c.profile}
                            alt={c.name}
                            className="w-full aspect-[2/3] object-cover rounded-lg border border-white/10 group-hover:border-indigo-500/50 transition-all"
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-xs border border-white/10">
                            👤
                          </div>
                        )}
                        <p className="text-xs text-white mt-1.5 truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{c.character}</p>
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
