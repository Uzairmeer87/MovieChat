import { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Welcome from "../components/Welcome";
import ChatView from "../components/ChatView";
import PromptBar from "../components/PromptBar";
import MovieModal from "../components/MovieModal";
import Watchlist from "../components/Watchlist";

import { useWatchlist } from "../hooks/useWatchlist";
import { sendMessage } from "../services/api";

export default function Home() {
  const { watchlist, addMovie, removeMovie, isInWatchlist, clearWatchlist } =
    useWatchlist();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalMovieId, setModalMovieId] = useState(null);
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  const hasMessages = messages.length > 0;

  function handleToggleWatchlist(movie) {
    if (isInWatchlist(movie.id)) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  }

  const handleSend = useCallback(
    async (text) => {
      if (!text || loading) return;

      // Add user message
      const userMsg = {
        sender: "user",
        text,
        movies: [],
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const data = await sendMessage(text);
        const botMsg = {
          sender: "bot",
          text: data.reply || "Here are some movies I found for you:",
          movies: data.movies || [],
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error("Chat error:", err);
        const botErrMsg = {
          sender: "bot",
          text: "I couldn't connect to the movie server. Please try again.",
          movies: [],
        };
        setMessages((prev) => [...prev, botErrMsg]);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  function handleNewChat() {
    setMessages([]);
    setModalMovieId(null);
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-app)",
        overflow: "hidden",
      }}
    >
      <Navbar
        watchlistCount={watchlist.length}
        onNewChat={handleNewChat}
        onOpenWatchlist={() => setWatchlistOpen(true)}
      />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {hasMessages ? (
          <ChatView
            messages={messages}
            loading={loading}
            onDetailsClick={(id) => setModalMovieId(id)}
            onWatchlistToggle={handleToggleWatchlist}
            isInWatchlist={isInWatchlist}
          />
        ) : (
          <Welcome onSuggestionClick={handleSend} />
        )}

        <PromptBar onSend={handleSend} loading={loading} />
      </div>

      {/* Watchlist Panel */}
      <Watchlist
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

      {/* Movie Details Modal */}
      {modalMovieId && (
        <MovieModal
          key={modalMovieId}
          movieId={modalMovieId}
          onClose={() => setModalMovieId(null)}
          isInWatchlist={isInWatchlist(modalMovieId)}
          onToggleWatchlist={handleToggleWatchlist}
          onFindSimilar={(query) => {
            setModalMovieId(null);
            handleSend(query);
          }}
        />
      )}
    </div>
  );
}
