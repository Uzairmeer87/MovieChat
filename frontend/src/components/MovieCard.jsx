export default function MovieCard({ movie, isInWatchlist, onToggleWatchlist, onClick }) {
  return (
    <div
      className="movie-card flex gap-3 rounded-2xl"
      onClick={onClick}
    >
      {/* Poster */}
      {movie.poster ? (
        <div className="poster-overlay flex-shrink-0">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            className="w-24 h-36 object-cover rounded-l-2xl"
            style={{ display: "block" }}
          />
        </div>
      ) : (
        <div className="w-24 h-36 bg-gradient-to-br from-indigo-900/50 to-slate-900 flex items-center justify-center flex-shrink-0 text-slate-500 text-2xl rounded-l-2xl">
          🎬
        </div>
      )}

      {/* Content */}
      <div className="py-2.5 pr-3 flex flex-col justify-between min-w-0 flex-1 relative z-[1]">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-sm leading-snug truncate">
              {movie.title}
            </h3>
            {/* 3D Bookmark button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist?.();
              }}
              className={`bookmark-btn flex-shrink-0 text-base transition-all duration-200 cursor-pointer hover:scale-125 ${
                isInWatchlist ? "active" : "text-slate-500 hover:text-indigo-400"
              }`}
              aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            >
              {isInWatchlist ? "★" : "☆"}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-slate-500">{movie.year}</span>
            <span className="rating-badge text-[10px] font-bold px-2 py-0.5 rounded-full">
              ★ {movie.rating?.toFixed(1)}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>
        </div>

        {/* Hover cue */}
        <div className="mt-2 text-[10px] text-indigo-400/60 font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
          CLICK FOR DETAILS →
        </div>
      </div>
    </div>
  );
}
