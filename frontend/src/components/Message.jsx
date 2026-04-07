import { useState } from "react";
import MovieCard from "./MovieCard";
import TypeWriter from "./TypeWriter";

/* ═══════════════════════════════════════════════════════════════
   SEARCH BADGE — visual indicators for search intelligence
   ═══════════════════════════════════════════════════════════════ */

function SearchBadge({ searchMeta }) {
  if (!searchMeta) return null;

  const { searchType, originalQuery, correctedQuery } = searchMeta;

  let badgeText = "";
  let badgeStyle = "";
  let icon = "";

  switch (searchType) {
    case "corrected":
      badgeText = `Auto-corrected: "${originalQuery}" → "${correctedQuery}"`;
      badgeStyle = "bg-amber-500/15 text-amber-300 border-amber-500/25";
      icon = "✨";
      break;
    case "phonetic":
      badgeText = `Sound match: "${originalQuery}" → "${correctedQuery}"`;
      badgeStyle = "bg-cyan-500/15 text-cyan-300 border-cyan-500/25";
      icon = "🔊";
      break;
    case "fuzzy":
      badgeText = `Showing similar results for "${originalQuery}"`;
      badgeStyle = "bg-blue-500/15 text-blue-300 border-blue-500/25";
      icon = "🔎";
      break;
    case "keyword_match":
      badgeText = `Matched by theme: "${originalQuery}"`;
      badgeStyle = "bg-emerald-500/15 text-emerald-300 border-emerald-500/25";
      icon = "🎯";
      break;
    case "recommendation":
      badgeText = `Similar movies recommended`;
      badgeStyle = "bg-violet-500/15 text-violet-300 border-violet-500/25";
      icon = "💡";
      break;
    case "trending_fallback":
      badgeText = `Showing trending movies instead`;
      badgeStyle = "bg-purple-500/15 text-purple-300 border-purple-500/25";
      icon = "🔥";
      break;
    default:
      return null;
  }

  return (
    <div
      className={`search-badge inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border mt-2 mb-1 animate-fade-in ${badgeStyle}`}
    >
      <span className="text-[10px]">{icon}</span>
      {badgeText}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MESSAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Message({
  sender,
  text,
  movies,
  searchMeta,
  isNew,
  isInWatchlist,
  onToggleWatchlist,
  onMovieClick,
}) {
  const isUser = sender === "user";
  const [typingDone, setTypingDone] = useState(!isNew);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 ${
        isNew ? (isUser ? "animate-slide-right" : "animate-slide-left") : ""
      }`}
    >
      <div
        className={`max-w-[85%] md:max-w-[75%] ${
          isUser
            ? "msg-user text-white rounded-2xl rounded-br-md"
            : "msg-bot text-slate-100 rounded-2xl rounded-bl-md"
        } px-4 py-3`}
      >
        {/* Message text */}
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {!isUser && isNew ? (
            <TypeWriter text={text} speed={15} onComplete={() => setTypingDone(true)} />
          ) : (
            text
          )}
        </div>

        {/* Search correction badge (bot only) */}
        {!isUser && searchMeta && typingDone && (
          <SearchBadge searchMeta={searchMeta} />
        )}

        {/* Movie cards (bot only, shown after typing finishes) */}
        {!isUser && movies && movies.length > 0 && typingDone && (
          <div className="mt-3 grid gap-2.5">
            {movies.map((m, i) => (
              <div
                key={m.id}
                className="animate-card-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <MovieCard
                  movie={m}
                  isInWatchlist={isInWatchlist?.(m.id)}
                  onToggleWatchlist={() => onToggleWatchlist?.(m)}
                  onClick={() => onMovieClick?.(m.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
