import { useState } from "react";
import { Star, Bookmark, Film, Info } from "lucide-react";
import { getMovieImageUrl } from "../../utils/imageUtils";

export default function MovieCard({
  movie,
  rank,
  isInWatchlist,
  onToggleWatchlist,
  onClick,
}) {
  const [imgError, setImgError] = useState(false);
  const [prevMovieId, setPrevMovieId] = useState(movie?.id);

  if (movie?.id !== prevMovieId) {
    setPrevMovieId(movie?.id);
    setImgError(false);
  }

  if (!movie) return null;

  // Resolve poster or backdrop image
  const rawSrc = movie.poster || movie.backdrop;
  const imageUrl = getMovieImageUrl(rawSrc);

  // Format rank badge color
  const rankClass =
    rank === 1
      ? "rank-badge-1"
      : rank === 2
      ? "rank-badge-2"
      : rank === 3
      ? "rank-badge-3"
      : rank === 4
      ? "rank-badge-4"
      : "rank-badge-default";

  // Genres display string
  const genreText = Array.isArray(movie.genres)
    ? movie.genres.join(" · ")
    : movie.genre || "";

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col h-full rounded-2xl bg-[#171a26] border border-white/10 overflow-hidden hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-950/30 transition-all duration-300 cursor-pointer"
    >
      {/* ── Rank Badge ──────────────────────────── */}
      {rank && <div className={`rank-badge ${rankClass}`}>{rank}</div>}

      {/* ── Poster Container ────────────────────── */}
      <div className="relative aspect-[16/10] sm:aspect-[16/10] overflow-hidden bg-slate-900">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={movie.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-400">
            <Film className="w-8 h-8 mb-1.5 text-orange-400/70 opacity-80" />
            <span className="text-xs font-semibold text-slate-200 line-clamp-1 font-outfit">
              {movie.title}
            </span>
          </div>
        )}

        {/* Top-right Watchlist quick toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist?.();
          }}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
            isInWatchlist
              ? "bg-orange-600 text-white border-orange-400 shadow-md"
              : "bg-black/60 text-slate-300 border-white/10 hover:text-white hover:bg-black/80"
          }`}
          title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>

        {/* Gradient Overlay for bottom text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171a26] via-transparent to-transparent opacity-80" />
      </div>

      {/* ── Card Details Content ─────────────────── */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating & Year Row */}
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-current text-amber-400" />
              <span>{movie.rating ? movie.rating.toFixed(1) : "N/A"}</span>
            </div>

            {movie.year && (
              <span className="text-[11px] font-medium text-slate-400">
                {movie.year}
              </span>
            )}
          </div>

          {/* Movie Title */}
          <h3 className="font-bold text-white text-sm leading-snug line-clamp-1 group-hover:text-orange-400 transition-colors font-outfit">
            {movie.title}
          </h3>

          {/* Genres */}
          {genreText && (
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
              {genreText}
            </p>
          )}

          {/* Overview text if present */}
          {movie.overview && (
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
              {movie.overview}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/5">
          <button
            onClick={onClick}
            className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Details</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist?.();
            }}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
              isInWatchlist
                ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
                : "bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10"
            }`}
            title={isInWatchlist ? "Saved in Watchlist" : "Save to Watchlist"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isInWatchlist ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
