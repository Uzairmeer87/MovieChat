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
      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
        />
      )}

      {/* ── Sliding Panel ── */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="h-full flex flex-col watchlist-panel"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* ── Panel Header ── */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.1))",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                🎯
              </div>
              <div>
                <h2 className="text-sm font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Watchlist
                </h2>
                {watchlist.length > 0 && (
                  <p className="text-[10px] text-slate-500">{watchlist.length} saved</p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              aria-label="Close watchlist"
            >
              ✕
            </button>
          </div>

          {/* ── Movie list ── */}
          <div className="flex-1 overflow-y-auto p-4 chat-scroll">
            {watchlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <div
                  className="w-16 h-16 flex items-center justify-center rounded-2xl text-3xl"
                  style={{
                    background: "rgba(15,20,40,0.5)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  🎬
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">Your watchlist is empty</p>
                  <p className="text-xs text-slate-600 mt-1 max-w-[200px]">
                    Tap the ☆ on any movie card to save it here
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {watchlist.map((movie, i) => (
                  <div
                    key={movie.id}
                    className="watchlist-item group flex gap-3 p-2.5 rounded-xl cursor-pointer animate-fade-in"
                    style={{
                      background: "rgba(12,18,38,0.5)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      animationDelay: `${i * 50}ms`,
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                      e.currentTarget.style.background = "rgba(18,25,55,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.background = "rgba(12,18,38,0.5)";
                    }}
                    onClick={() => onMovieClick(movie.id)}
                  >
                    {/* Poster */}
                    {movie.poster ? (
                      <div
                        className="flex-shrink-0 rounded-lg overflow-hidden"
                        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-[68px] object-cover block"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-12 h-[68px] rounded-lg flex-shrink-0 flex items-center justify-center text-slate-600 text-sm"
                        style={{ background: "rgba(15,20,40,0.6)" }}
                      >
                        🎬
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0 py-0.5">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        <span>{movie.year}</span>
                        <span className="text-yellow-400">★ {movie.rating?.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveMovie(movie.id);
                      }}
                      className="self-center w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      style={{ background: "rgba(239,68,68,0.08)" }}
                      aria-label="Remove from watchlist"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          {watchlist.length > 0 && (
            <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button
                onClick={onClear}
                className="w-full py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  color: "#f87171",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)";
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
