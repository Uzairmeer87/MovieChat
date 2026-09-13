import { useState } from "react";
import { Bookmark, X, Trash2, Star, Film } from "lucide-react";
import { getMovieImageUrl } from "../../utils/imageUtils";

function WatchlistPoster({ movie }) {
  const [error, setError] = useState(false);
  const src = getMovieImageUrl(movie.poster || movie.backdrop);

  if (!src || error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
        <Film className="w-5 h-5 text-orange-400/60" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={movie.title}
      onError={() => setError(true)}
      className="w-full h-full object-cover"
    />
  );
}

export default function WatchlistPanel({
  isOpen,
  onClose,
  watchlist = [],
  onRemoveMovie,
  onClear,
  onMovieClick,
}) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-over Drawer Container */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[#0d0e14] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white font-outfit">My Watchlist</h2>
              <p className="text-[11px] text-slate-400">
                {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Movie List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {watchlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-slate-500">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400">
                <Bookmark className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300">Your watchlist is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                  Click the bookmark icon on any movie card to save it here.
                </p>
              </div>
            </div>
          ) : (
            watchlist.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onMovieClick(movie.id)}
                className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 hover:bg-white/10 transition-all cursor-pointer"
              >
                {/* Poster Thumbnail */}
                <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                  <WatchlistPoster movie={movie} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors font-outfit">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>{movie.year}</span>
                    <div className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{movie.rating ? movie.rating.toFixed(1) : "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMovie(movie.id);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Clear Action */}
        {watchlist.length > 0 && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={onClear}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Saved Movies</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
