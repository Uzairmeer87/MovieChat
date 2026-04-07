import { useState } from "react";
import ChatBox from "../components/ChatBox";
import WatchlistPanel from "../components/WatchlistPanel";
import MovieModal from "../components/MovieModal";
import { useWatchlist } from "../hooks/useWatchlist";

export default function Home() {
  const { watchlist, addMovie, removeMovie, isInWatchlist, clearWatchlist } = useWatchlist();
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [modalMovieId, setModalMovieId] = useState(null);

  function handleToggleWatchlist(movie) {
    if (isInWatchlist(movie.id)) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  }

  return (
    <div className="h-screen flex flex-col app-bg dot-grid relative">
      {/* ── Header ───────────────────────── */}
      <header className="header-glass header-glow flex items-center justify-between px-5 py-3.5 relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse-glow rounded-full p-1">🎬</span>
          <h1 className="text-xl font-bold gradient-text tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Movie Chatbot
          </h1>
        </div>

        {/* Watchlist toggle */}
        <button
          onClick={() => setWatchlistOpen(true)}
          className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-slate-300 hover:text-white glass hover:border-indigo-500/30 transition-all cursor-pointer group"
        >
          <span className="group-hover:scale-110 transition-transform">🎯</span>
          <span className="hidden sm:inline">Watchlist</span>
          {watchlist.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/40">
              {watchlist.length}
            </span>
          )}
        </button>
      </header>

      {/* ── Chat area ────────────────────── */}
      <main className="flex-1 overflow-hidden max-w-3xl w-full mx-auto relative z-[1]">
        <ChatBox
          isInWatchlist={isInWatchlist}
          onToggleWatchlist={handleToggleWatchlist}
          onMovieClick={(id) => setModalMovieId(id)}
        />
      </main>

      {/* ── Watchlist Panel ───────────────── */}
      <WatchlistPanel
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        watchlist={watchlist}
        onRemoveMovie={removeMovie}
        onClear={clearWatchlist}
        onMovieClick={(id) => {
          setWatchlistOpen(false);
          setModalMovieId(id);
        }}
      />

      {/* ── Movie Detail Modal ───────────── */}
      {modalMovieId && (
        <MovieModal
          movieId={modalMovieId}
          onClose={() => setModalMovieId(null)}
          isInWatchlist={isInWatchlist(modalMovieId)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}
    </div>
  );
}
