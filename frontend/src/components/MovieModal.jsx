import { useState, useEffect } from "react";
import {
  X,
  Star,
  Clock,
  Calendar,
  BookmarkPlus,
  BookmarkCheck,
  Sparkles,
  Play,
  User,
} from "lucide-react";
import { getMovieDetails } from "../services/api";
import { getMovieImageUrl } from "../utils/imageUtils";

const FALLBACK_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' fill='%23141418'%3E%3Crect width='300' height='450'/%3E%3Ctext x='150' y='225' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%235a5a5a'%3ENo Poster%3C/text%3E%3C/svg%3E";

function Skeleton({ width, height, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, flexShrink: 0, ...style }}
    />
  );
}

function LoadingState() {
  return (
    <div style={{ padding: 24 }}>
      <Skeleton width="100%" height={200} style={{ borderRadius: "var(--radius-md)", marginBottom: 20 }} />
      <Skeleton width="60%" height={24} style={{ marginBottom: 12 }} />
      <Skeleton width="40%" height={16} style={{ marginBottom: 20 }} />
      <Skeleton width="100%" height={60} style={{ marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <Skeleton width={80} height={100} style={{ borderRadius: "var(--radius-sm)" }} />
        <Skeleton width={80} height={100} style={{ borderRadius: "var(--radius-sm)" }} />
        <Skeleton width={80} height={100} style={{ borderRadius: "var(--radius-sm)" }} />
      </div>
    </div>
  );
}

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
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!movieId) return;
    let cancelled = false;

    getMovieDetails(movieId)
      .then((data) => {
        if (!cancelled) setMovie(data);
      })
      .catch((err) => {
        console.error("Failed to load movie details:", err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [movieId]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const trailer = movie?.videos?.find((v) => v.type === "Trailer") || movie?.videos?.[0];
  const backdropUrl = getMovieImageUrl(movie?.backdrop);
  const posterUrl = getMovieImageUrl(movie?.poster) || FALLBACK_POSTER;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "95%",
          maxWidth: 680,
          maxHeight: "90vh",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-overlay)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            width: 32,
            height: 32,
            borderRadius: "var(--radius-sm)",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Close movie details"
        >
          <X size={16} />
        </button>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading && <LoadingState />}

          {error && !loading && (
            <div style={{ padding: 40, textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                Could not load movie details. Please try again.
              </p>
            </div>
          )}

          {movie && !loading && !error && (
            <>
              {/* Backdrop / Trailer */}
              {showTrailer && trailer ? (
                <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
                  <iframe
                    src={`${trailer.url}?autoplay=1`}
                    title={trailer.name}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    background: backdropUrl
                      ? `url(${backdropUrl}) center/cover no-repeat`
                      : "linear-gradient(135deg, #1a1a20 0%, #0a0a0c 100%)",
                    overflow: "hidden",
                  }}
                >
                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, var(--bg-surface) 0%, transparent 60%)",
                    }}
                  />
                  {/* Play trailer button */}
                  {trailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                        border: "2px solid rgba(255,255,255,0.2)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--accent)";
                        e.currentTarget.style.borderColor = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.6)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                      }}
                      aria-label="Play trailer"
                    >
                      <Play size={22} fill="#fff" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div style={{ padding: "16px 24px 24px" }}>
                {/* Title row */}
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  {/* Small poster */}
                  <img
                    src={posterUrl}
                    alt={`${movie.title} poster`}
                    style={{
                      width: 80,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-subtle)",
                      flexShrink: 0,
                    }}
                    onError={(e) => { e.target.src = FALLBACK_POSTER; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "clamp(18px, 4vw, 24px)",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {movie.title}
                    </h2>
                    {movie.tagline && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--text-muted)",
                          fontStyle: "italic",
                          margin: "4px 0 0",
                        }}
                      >
                        {movie.tagline}
                      </p>
                    )}

                    {/* Meta chips */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginTop: 10,
                      }}
                    >
                      <MetaChip icon={<Star size={12} fill="#f59e0b" stroke="none" />} color="#f59e0b">
                        {Number(movie.rating).toFixed(1)}
                      </MetaChip>
                      <MetaChip icon={<Calendar size={12} />}>
                        {movie.year}
                      </MetaChip>
                      {movie.runtime > 0 && (
                        <MetaChip icon={<Clock size={12} />}>
                          {formatRuntime(movie.runtime)}
                        </MetaChip>
                      )}
                    </div>
                  </div>
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {movie.genres.map((g) => (
                      <span
                        key={g}
                        style={{
                          padding: "4px 10px",
                          fontSize: 11,
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: 999,
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                    margin: "0 0 20px",
                  }}
                >
                  {movie.overview}
                </p>

                {/* Cast */}
                {movie.cast && movie.cast.length > 0 && (
                  <Section title="Cast">
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        overflowX: "auto",
                        paddingBottom: 4,
                      }}
                      className="no-scrollbar"
                    >
                      {movie.cast.slice(0, 8).map((person) => (
                        <CastCard key={person.id} person={person} />
                      ))}
                    </div>
                  </Section>
                )}

                {/* Crew */}
                {movie.crew && movie.crew.length > 0 && (
                  <Section title="Crew">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {movie.crew.map((person, idx) => (
                        <span
                          key={`${person.id}-${idx}`}
                          style={{
                            padding: "5px 10px",
                            fontSize: 12,
                            color: "var(--text-secondary)",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                            {person.name}
                          </strong>{" "}
                          · {person.job}
                        </span>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button
                    onClick={() => onToggleWatchlist(movie)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      padding: "10px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      background: isInWatchlist ? "var(--accent)" : "var(--bg-surface-elevated)",
                      color: isInWatchlist ? "#fff" : "var(--text-primary)",
                      border: `1px solid ${isInWatchlist ? "var(--accent)" : "var(--border-subtle)"}`,
                      borderRadius: "var(--radius-md)",
                      transition: "var(--transition-fast)",
                    }}
                  >
                    {isInWatchlist ? <BookmarkCheck size={15} /> : <BookmarkPlus size={15} />}
                    {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </button>

                  <button
                    onClick={() => onFindSimilar(`movies like ${movie.title}`)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      padding: "10px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      background: "transparent",
                      color: "var(--accent)",
                      border: "1px solid var(--accent)",
                      borderRadius: "var(--radius-md)",
                      transition: "var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--accent-muted)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Sparkles size={15} />
                    Find Similar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function CastCard({ person }) {
  return (
    <div
      style={{
        width: 72,
        flexShrink: 0,
        textAlign: "center",
      }}
    >
      {person.profile ? (
        <img
          src={person.profile}
          alt={person.name}
          loading="lazy"
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid var(--border-subtle)",
            margin: "0 auto 6px",
          }}
        />
      ) : (
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 6px",
          }}
        >
          <User size={18} color="var(--text-muted)" />
        </div>
      )}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-primary)",
          lineHeight: 1.3,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={person.name}
      >
        {person.name}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={person.character}
      >
        {person.character}
      </div>
    </div>
  );
}

function MetaChip({ icon, children, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        fontSize: 12,
        fontWeight: 500,
        color: color || "var(--text-secondary)",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "var(--radius-sm)",
      }}
    >
      {icon}
      {children}
    </span>
  );
}

function formatRuntime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
