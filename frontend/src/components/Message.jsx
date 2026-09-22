import { Film, User } from "lucide-react";
import MovieGrid from "./MovieGrid";

export default function Message({
  message,
  onDetailsClick,
  onWatchlistToggle,
  isInWatchlist,
}) {
  const isUser = message.sender === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 20,
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          maxWidth: isUser ? 480 : "100%",
          width: isUser ? "auto" : "100%",
        }}
      >
        {/* Avatar + Name row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
            flexDirection: isUser ? "row-reverse" : "row",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "var(--radius-sm)",
              background: isUser ? "rgba(255,255,255,0.08)" : "var(--accent-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isUser ? (
              <User size={13} color="var(--text-secondary)" />
            ) : (
              <Film size={13} color="var(--accent)" />
            )}
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: isUser ? "var(--text-secondary)" : "var(--accent)",
            }}
          >
            {isUser ? "You" : "MovieChat"}
          </span>
        </div>

        {/* Message Text */}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            background: isUser ? "rgba(255,255,255,0.06)" : "var(--bg-surface)",
            border: `1px solid ${isUser ? "rgba(255,255,255,0.08)" : "var(--border-subtle)"}`,
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--text-primary)",
          }}
        >
          {message.text}
        </div>

        {/* Movie Grid for bot messages */}
        {!isUser && message.movies && message.movies.length > 0 && (
          <MovieGrid
            movies={message.movies}
            onDetailsClick={onDetailsClick}
            onWatchlistToggle={onWatchlistToggle}
            isInWatchlist={isInWatchlist}
          />
        )}
      </div>
    </div>
  );
}
