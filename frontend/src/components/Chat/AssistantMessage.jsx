import { useState } from "react";
import { Film, Copy, RotateCcw, Check, Sparkles, Volume2, Search, Target, Flame } from "lucide-react";
import MovieCarousel from "../Movies/MovieCarousel";
import TypeWriter from "../TypeWriter";

function SearchBadge({ searchMeta }) {
  if (!searchMeta) return null;
  const { searchType, originalQuery, correctedQuery } = searchMeta;

  let label = "";
  let icon = Sparkles;
  let style = "bg-amber-500/10 text-amber-400 border-amber-500/20";

  switch (searchType) {
    case "corrected":
      label = `Auto-corrected: "${originalQuery}" → "${correctedQuery}"`;
      icon = Sparkles;
      style = "bg-amber-500/15 text-amber-300 border-amber-500/30";
      break;
    case "phonetic":
      label = `Sound match: "${originalQuery}" → "${correctedQuery}"`;
      icon = Volume2;
      style = "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
      break;
    case "fuzzy":
      label = `Similar match for "${originalQuery}"`;
      icon = Search;
      style = "bg-blue-500/15 text-blue-300 border-blue-500/30";
      break;
    case "keyword_match":
      label = `Matched by theme: "${originalQuery}"`;
      icon = Target;
      style = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      break;
    case "trending_fallback":
      label = `Showing trending movies instead`;
      icon = Flame;
      style = "bg-purple-500/15 text-purple-300 border-purple-500/30";
      break;
    default:
      return null;
  }

  const IconComp = icon;

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border mb-3 animate-fade-in ${style}`}>
      <IconComp className="w-3.5 h-3.5" />
      <span className="font-medium">{label}</span>
    </div>
  );
}

export default function AssistantMessage({
  text,
  movies = [],
  searchMeta,
  isNew,
  isInWatchlist,
  onToggleWatchlist,
  onMovieClick,
  onRetry,
}) {
  const [typingDone, setTypingDone] = useState(!isNew);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex justify-start mb-6 animate-fade-in">
      <div className="flex items-start gap-3 max-w-full sm:max-w-[90%] md:max-w-[85%]">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-950/40 border border-white/10 mt-0.5">
          <Film className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Main Bubble / Container */}
          <div className="rounded-2xl rounded-tl-xs px-4 py-3.5 bg-[#171a26] border border-white/10 shadow-xl">
            {/* AI Text Response */}
            <div className="text-sm text-slate-100 leading-relaxed whitespace-pre-line font-normal">
              {!typingDone && isNew ? (
                <TypeWriter text={text} speed={15} onComplete={() => setTypingDone(true)} />
              ) : (
                text
              )}
            </div>

            {/* Search Intelligence Badge */}
            {searchMeta && typingDone && <SearchBadge searchMeta={searchMeta} />}

            {/* Movie Recommendation Carousel */}
            {movies && movies.length > 0 && typingDone && (
              <div className="mt-3">
                <MovieCarousel
                  movies={movies}
                  isInWatchlist={isInWatchlist}
                  onToggleWatchlist={onToggleWatchlist}
                  onMovieClick={onMovieClick}
                />
              </div>
            )}

            {/* Bottom Action Bar */}
            {typingDone && (
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5 text-xs text-slate-400">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                  title="Copy response"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                    title="Retry query"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try again</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
