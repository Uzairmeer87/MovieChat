/**
 * WatchlistPanel — slide-out drawer showing saved movies.
 *
 * Props:
 *   isOpen          — boolean
 *   onClose         — callback
 *   watchlist       — array of movie objects
 *   onRemoveMovie   — callback(movieId)
 *   onClear         — callback
 *   onMovieClick    — callback(movieId)
 */
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
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col watchlist-panel border-l border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <h2 className="text-lg font-bold text-white">Watchlist</h2>
              {watchlist.length > 0 && (
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  {watchlist.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              aria-label="Close watchlist"
            >
              ✕
            </button>
          </div>

          {/* Movie list */}
          <div className="flex-1 overflow-y-auto p-4 chat-scroll">
            {watchlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                <span className="text-5xl mb-4 opacity-50">🎬</span>
                <p className="text-sm font-medium text-slate-400">Your watchlist is empty</p>
                <p className="text-xs mt-1.5 max-w-[200px]">
                  Click the bookmark icon on any movie card to save it here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {watchlist.map((movie, i) => (
                  <div
                    key={movie.id}
                    className="group flex gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/8 transition-all cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                    onClick={() => onMovieClick(movie.id)}
                  >
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-14 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-20 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-xs flex-shrink-0">
                        🎬
                      </div>
                    )}
                    <div className="flex-1 min-w-0 py-0.5">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <span>{movie.year}</span>
                        <span className="text-yellow-400">★ {movie.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveMovie(movie.id);
                      }}
                      className="self-center w-7 h-7 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                      aria-label="Remove from watchlist"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer — Clear all */}
          {watchlist.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <button
                onClick={onClear}
                className="w-full py-2.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-xl transition-all cursor-pointer"
              >
                Clear Watchlist
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
