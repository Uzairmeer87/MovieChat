import { X, Trash2, BookmarkX, Film } from "lucide-react";
import { getMovieImageUrl } from "../utils/imageUtils";

const FALLBACK_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='90' fill='%23141418'%3E%3Crect width='60' height='90'/%3E%3Ctext x='30' y='45' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='8' fill='%235a5a5a'%3ENo Img%3C/text%3E%3C/svg%3E";

export default function Watchlist({
  isOpen,
  onClose,
  watchlist,
  onRemoveMovie,
  onClear,
  onMovieClick,
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(0,0,0,0.5)",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="slide-panel"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 91,
          width: "min(380px, 90vw)",
          background: "var(--bg-app)",
          borderLeft: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Watchlist
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0" }}>
              {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
            </p>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {watchlist.length > 0 && (
              <button
                onClick={onClear}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  background: "transparent",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  transition: "var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ef4444";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                }}
                aria-label="Clear watchlist"
              >
                <Trash2 size={12} />
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                borderRadius: "var(--radius-sm)",
              }}
              aria-label="Close watchlist"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
          {watchlist.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 12,
                color: "var(--text-muted)",
              }}
            >
              <Film size={32} />
              <p style={{ fontSize: 14 }}>No movies saved yet</p>
              <p style={{ fontSize: 12 }}>
                Click the bookmark icon on any movie to save it here.
              </p>
            </div>
          ) : (
            watchlist.map((movie) => (
              <div
                key={movie.id}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "10px 8px",
                  borderRadius: "var(--radius-md)",
                  transition: "var(--transition-fast)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--bg-surface)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                onClick={() => onMovieClick(movie.id)}
              >
                <img
                  src={getMovieImageUrl(movie.poster) || FALLBACK_POSTER}
                  alt={`${movie.title} poster`}
                  style={{
                    width: 48,
                    height: 72,
                    objectFit: "cover",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                    flexShrink: 0,
                  }}
                  onError={(e) => { e.target.src = FALLBACK_POSTER; }}
                />
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {movie.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {movie.year} · ⭐ {Number(movie.rating).toFixed(1)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveMovie(movie.id);
                  }}
                  style={{
                    alignSelf: "center",
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    borderRadius: "var(--radius-sm)",
                    transition: "var(--transition-fast)",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                  aria-label={`Remove ${movie.title} from watchlist`}
                >
                  <BookmarkX size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
