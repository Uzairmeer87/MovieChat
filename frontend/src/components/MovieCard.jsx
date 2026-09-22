import { Star, BookmarkPlus, BookmarkCheck, Info } from "lucide-react";
import { getMovieImageUrl } from "../utils/imageUtils";

const FALLBACK_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' fill='%23141418'%3E%3Crect width='300' height='450'/%3E%3Ctext x='150' y='225' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%235a5a5a'%3ENo Poster%3C/text%3E%3C/svg%3E";

export default function MovieCard({
  movie,
  onDetailsClick,
  onWatchlistToggle,
  isInWatchlist,
}) {
  const posterSrc = getMovieImageUrl(movie.poster) || FALLBACK_POSTER;
  const rating = movie.rating ? Number(movie.rating).toFixed(1) : "—";

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        transition: "var(--transition-normal)",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "var(--border-medium)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Poster */}
      <div
        style={{ position: "relative", aspectRatio: "2/3", cursor: "pointer" }}
        onClick={() => onDetailsClick(movie.id)}
      >
        <img
          src={posterSrc}
          alt={`${movie.title} poster`}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.src = FALLBACK_POSTER;
          }}
        />

        {/* Rating Badge */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            alignItems: "center",
            gap: 3,
            padding: "3px 7px",
            borderRadius: "var(--radius-sm)",
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            fontSize: 12,
            fontWeight: 600,
            color: "#f59e0b",
          }}
        >
          <Star size={11} fill="#f59e0b" stroke="none" />
          {rating}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 12px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.3,
            marginBottom: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={movie.title}
        >
          {movie.title}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            marginBottom: 6,
          }}
        >
          {movie.year || "—"}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            marginBottom: 10,
            flex: 1,
          }}
        >
          {movie.overview || "No overview available."}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onDetailsClick(movie.id)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "7px 0",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-secondary)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              transition: "var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.borderColor = "var(--border-medium)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.borderColor = "var(--border-subtle)";
            }}
            aria-label={`View details for ${movie.title}`}
          >
            <Info size={13} />
            Details
          </button>

          <button
            onClick={() => onWatchlistToggle(movie)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              background: isInWatchlist
                ? "var(--accent-muted)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${isInWatchlist ? "var(--accent)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-sm)",
              color: isInWatchlist ? "var(--accent)" : "var(--text-secondary)",
              transition: "var(--transition-fast)",
              flexShrink: 0,
            }}
            aria-label={
              isInWatchlist
                ? `Remove ${movie.title} from watchlist`
                : `Add ${movie.title} to watchlist`
            }
          >
            {isInWatchlist ? (
              <BookmarkCheck size={14} />
            ) : (
              <BookmarkPlus size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
