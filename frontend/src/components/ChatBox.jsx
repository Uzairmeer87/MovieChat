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
      text: "Hey there! 🎬 I'm your Movie Bot.\nAsk me things like:\n• \"Suggest a comedy\"\n• \"I'm in the mood for horror\"\n• \"Search for Inception\"\n• \"Movies by Tom Hanks\"\n• \"90s action movies\"\n• \"Korean films\"\n• \"Directed by Nolan\"",
      movies: [],
      searchMeta: null,
      isNew: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const lastSendRef = useRef(0);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (text) => {
      const msg = (text || input).trim();
      if (!msg || loading) return;

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
        inputRef.current?.focus();
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
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 chat-scroll space-y-1">
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
            <div className="msg-bot rounded-2xl rounded-bl-md px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="typing-dot w-2 h-2 bg-indigo-400 rounded-full" style={{ animationDelay: "0ms" }} />
                  <span className="typing-dot w-2 h-2 bg-purple-400 rounded-full" style={{ animationDelay: "200ms" }} />
                  <span className="typing-dot w-2 h-2 bg-violet-400 rounded-full" style={{ animationDelay: "400ms" }} />
                </div>
                <span className="text-xs text-slate-500">Finding movies...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestion chips ─────────────── */}
      {messages.length <= 1 && (
        <div className="px-3 sm:px-4 pb-3 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-2 px-1">
            Try asking...
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="chip text-xs text-slate-300 hover:text-white rounded-full px-3 py-1.5 cursor-pointer font-medium relative z-[1]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input bar ────────────────────── */}
      <div className="p-3 sm:p-4 relative z-10">
        {/* 3D Input Container */}
        <div
          className="glass-strong rounded-2xl p-1.5 flex gap-2"
          style={{
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about movies…"
            disabled={loading}
            className="flex-1 bg-transparent px-3 sm:px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none disabled:opacity-40"
          />
          <button
            id="send-button"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="send-btn text-white rounded-xl px-4 sm:px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            <span className="hidden sm:inline">Send</span>
            <span className="sm:hidden">↑</span>
          </button>
        </div>
      </div>
    </div>
  );
}
