export default function MovieCard({ movie, isInWatchlist, onToggleWatchlist, onClick }) {
  return (
    <div className="movie-card flex gap-3 rounded-xl" onClick={onClick}>
      {/* Poster with gradient overlay */}
      {movie.poster ? (
        <div className="poster-overlay flex-shrink-0">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            className="w-24 h-36 object-cover rounded-l-xl"
          />
        </div>
      ) : (
        <div className="w-24 h-36 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0 text-slate-500 text-xs rounded-l-xl">
          🎬
        </div>
      )}

      <div className="py-2.5 pr-3 flex flex-col justify-between min-w-0 flex-1 relative z-[1]">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-sm truncate">
              {movie.title}
            </h3>
            {/* Bookmark button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist?.();
              }}
              className={`bookmark-btn flex-shrink-0 text-sm transition-all cursor-pointer hover:scale-110 ${
                isInWatchlist ? "active" : "text-slate-500 hover:text-indigo-400"
              }`}
              aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isInWatchlist ? "★" : "☆"}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">{movie.year}</span>
            <span className="rating-badge text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
              ★ {movie.rating.toFixed(1)}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>
        </div>
      </div>
    </div>
  );
}
