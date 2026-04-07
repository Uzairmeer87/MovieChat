import { useState, useRef, useEffect, useCallback } from "react";
import { sendMessage } from "../services/api";
import Message from "./Message";

const SUGGESTIONS = [
  "Suggest a comedy 😂",
  "I feel excited 🔥",
  "Directed by Nolan 🎥",
  "90s action movies 📽️",
  "Korean films 🇰🇷",
  "Hidden gems 💎",
  "Movies about space 🚀",
  "Something like Interstellar ✨",
  "Movies by Tom Hanks 🌟",
  "Top rated thrillers ⭐",
  "Bollywood hits 🕺",
  "Coming of age films 🎓",
  "Horror movies from 2020 👻",
  "Road trip movies 🚗",
];

export default function ChatBox({ isInWatchlist, onToggleWatchlist, onMovieClick }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey there! 🎬 I'm your Movie Bot.\nAsk me things like:\n• \"Suggest a comedy\"\n• \"I'm in the mood for horror\"\n• \"Search for Inception\"\n• \"Movies by Tom Hanks\"\n• \"Movies about space\"\n• \"Something like Interstellar\"\n• \"I feel happy\"",
      movies: [],
      searchMeta: null,
      isNew: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const lastSendRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Debounced send — prevents double-sends within 400ms */
  const handleSend = useCallback(
    async (text) => {
      const msg = (text || input).trim();
      if (!msg || loading) return;

      // Debounce protection
      const now = Date.now();
      if (now - lastSendRef.current < 400) return;
      lastSendRef.current = now;

      setMessages((prev) =>
        prev.map((m) => ({ ...m, isNew: false })).concat({
          sender: "user",
          text: msg,
          movies: [],
          searchMeta: null,
          isNew: true,
        })
      );
      setInput("");
      setLoading(true);

      try {
        const data = await sendMessage(msg);
        setMessages((prev) =>
          prev.map((m) => ({ ...m, isNew: false })).concat({
            sender: "bot",
            text: data.reply,
            movies: data.movies || [],
            searchMeta: data.searchMeta || null,
            isNew: true,
          })
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) => ({ ...m, isNew: false })).concat({
            sender: "bot",
            text: "Oops! I couldn't reach the server. Make sure the backend is running on port 5000.",
            movies: [],
            searchMeta: null,
            isNew: true,
          })
        );
      } finally {
        setLoading(false);
      }
    },
    [input, loading]
  );

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Message area ─────────────────── */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 chat-scroll">
        {messages.map((m, i) => (
          <Message
            key={i}
            sender={m.sender}
            text={m.text}
            movies={m.movies}
            searchMeta={m.searchMeta}
            isNew={m.isNew}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={onToggleWatchlist}
            onMovieClick={onMovieClick}
          />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start mb-4 animate-fade-in">
            <div className="msg-bot rounded-2xl rounded-bl-md px-5 py-3.5">
              <div className="flex gap-2">
                <span className="typing-dot w-2 h-2 bg-indigo-400 rounded-full" style={{ animationDelay: "0ms" }} />
                <span className="typing-dot w-2 h-2 bg-purple-400 rounded-full" style={{ animationDelay: "200ms" }} />
                <span className="typing-dot w-2 h-2 bg-violet-400 rounded-full" style={{ animationDelay: "400ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestion chips ─────────────── */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="chip text-xs text-slate-300 hover:text-white rounded-full px-3.5 py-2 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input bar ────────────────────── */}
      <div className="p-3 sm:p-4 relative z-10">
        <div className="flex gap-2 sm:gap-2.5 max-w-3xl mx-auto">
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about movies…"
            disabled={loading}
            className="flex-1 input-glass rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder-slate-500 outline-none disabled:opacity-40"
          />
          <button
            id="send-button"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="send-btn text-white rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
