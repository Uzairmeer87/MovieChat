import { Film, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Movies like Interstellar",
  "Best sci-fi tonight",
  "Feel-good movies",
  "Highest rated movies",
];

export default function Welcome({ onSuggestionClick }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
        maxWidth: 600,
        margin: "0 auto",
      }}
      className="animate-fade-in"
    >
      {/* Icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "var(--radius-lg)",
          background: "var(--accent-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Film size={28} color="var(--accent)" />
      </div>

      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 12px",
          borderRadius: 999,
          background: "var(--accent-muted)",
          color: "var(--accent)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        <Sparkles size={12} />
        AI-Powered Movie Discovery
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          margin: "0 0 12px",
          lineHeight: 1.2,
        }}
      >
        What do you want to watch?
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          margin: "0 0 32px",
          maxWidth: 440,
        }}
      >
        Search by title, mood, genre, actor, director, year — or just describe
        what you feel like watching.
      </p>

      {/* Suggestion Chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => onSuggestionClick(text)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 999,
              transition: "var(--transition-fast)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.background = "var(--accent-muted)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.background = "var(--bg-surface)";
            }}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
