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
    <div className="h-screen flex flex-col app-bg dot-grid relative overflow-hidden">

      {/* ── Floating Ambient Orbs ─────────────────────────────── */}
      <div
        className="orb"
        style={{
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)",
          top: "-100px", left: "-150px",
          animationDuration: "10s",
        }}
      />
      <div
        className="orb"
        style={{
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(168,85,247,0.07), transparent 70%)",
          bottom: "-50px", right: "-100px",
          animationDuration: "14s",
          animationDelay: "-5s",
        }}
      />
      <div
        className="orb"
        style={{
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(236,72,153,0.05), transparent 70%)",
          top: "40%", right: "30%",
          animationDuration: "18s",
          animationDelay: "-8s",
        }}
      />

      {/* ── Header ───────────────────────── */}
      <header className="header-glass header-glow flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 relative z-10">
        <div className="flex items-center gap-3">
          {/* 3D Logo Box */}
          <div className="logo-3d">
            <span className="text-lg">🎬</span>
          </div>
          <div>
            <h1
              className="text-lg sm:text-xl font-bold gradient-text animate-neon tracking-tight"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              MovieChat
            </h1>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <div className="status-indicator" />
              <span className="text-[10px] text-slate-500 font-medium">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Watchlist toggle */}
        <button
          onClick={() => setWatchlistOpen(true)}
          className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm text-slate-300 hover:text-white glass hover:border-indigo-500/40 transition-all cursor-pointer group"
          style={{ transform: "translateZ(0)" }}
        >
          <span className="text-base group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">🎯</span>
          <span className="hidden sm:inline font-medium">Watchlist</span>
          {watchlist.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50 animate-pulse-glow">
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
