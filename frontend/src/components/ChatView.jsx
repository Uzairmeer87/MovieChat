import { useRef, useEffect } from "react";
import { Film } from "lucide-react";
import Message from "./Message";

function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 20,
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "var(--radius-sm)",
          background: "var(--accent-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <Film size={13} color="var(--accent)" />
      </div>
      <div
        style={{
          padding: "12px 16px",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span className="typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot" style={{ animationDelay: "200ms" }} />
        <span className="typing-dot" style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  );
}

export default function ChatView({
  messages,
  loading,
  onDetailsClick,
  onWatchlistToggle,
  isInWatchlist,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 780,
          margin: "0 auto",
        }}
      >
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            message={msg}
            onDetailsClick={onDetailsClick}
            onWatchlistToggle={onWatchlistToggle}
            isInWatchlist={isInWatchlist}
          />
        ))}

        {loading && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
