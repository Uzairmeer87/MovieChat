import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";

export default function PromptBar({ onSend, loading, disabled }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div
      style={{
        padding: "12px 16px 16px",
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-app)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 6px 6px 16px",
          background: "var(--bg-input)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          transition: "var(--transition-fast)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--border-medium)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border-subtle)";
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask for a movie, actor, genre, mood or similar films..."
          disabled={loading || disabled}
          autoComplete="off"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: 14,
            fontFamily: "inherit",
            padding: "8px 0",
          }}
          aria-label="Movie search input"
        />
        <button
          type="submit"
          disabled={!value.trim() || loading || disabled}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "var(--radius-md)",
            border: "none",
            background:
              value.trim() && !loading
                ? "var(--accent)"
                : "rgba(255,255,255,0.06)",
            color:
              value.trim() && !loading ? "#fff" : "var(--text-muted)",
            transition: "var(--transition-fast)",
            flexShrink: 0,
          }}
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <SendHorizontal size={16} />
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
