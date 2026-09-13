import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import SettingsModal from "../components/Layout/SettingsModal";
import ShareModal from "../components/Chat/ShareModal";
import ChatContainer from "../components/Chat/ChatContainer";
import WatchlistPanel from "../components/Movies/WatchlistPanel";
import MovieModal from "../components/Movies/MovieModal";

import { useWatchlist } from "../hooks/useWatchlist";
import { useChatHistory } from "../hooks/useChatHistory";
import { sendMessage } from "../services/api";

export default function Home() {
  const { watchlist, addMovie, removeMovie, isInWatchlist, clearWatchlist } =
    useWatchlist();
  const {
    sessions,
    activeSession,
    activeId,
    createNewChat,
    selectChat,
    deleteChat,
    renameChat,
    addMessageToActiveChat,
  } = useChatHistory();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [modalMovieId, setModalMovieId] = useState(null);
  const [activeNav, setActiveNav] = useState("home");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleToggleWatchlist(movie) {
    if (isInWatchlist(movie.id)) {
      removeMovie(movie.id);
    } else {
      addMovie(movie);
    }
  }

  const handleSendMessage = useCallback(
    async (text) => {
      if (!text || loading) return;

      const userMsg = {
        sender: "user",
        text,
        movies: [],
        searchMeta: null,
        isNew: true,
        timestamp: Date.now(),
      };

      // Add user message to active chat
      addMessageToActiveChat(userMsg);
      setLoading(true);
      setError(false);

      try {
        const data = await sendMessage(text);
        const botMsg = {
          sender: "bot",
          text: data.reply || "Here are some movies I found for you:",
          movies: data.movies || [],
          searchMeta: data.searchMeta || null,
          isNew: true,
          timestamp: Date.now(),
        };
        addMessageToActiveChat(botMsg);
      } catch (err) {
        console.error("Chat error:", err);
        setError(true);
        const botErrMsg = {
          sender: "bot",
          text: "Oops! I couldn't reach the backend server. Please make sure the backend is correctly deployed and configured.",
          movies: [],
          searchMeta: null,
          isNew: true,
          timestamp: Date.now(),
        };
        addMessageToActiveChat(botErrMsg);
      } finally {
        setLoading(false);
      }
    },
    [loading, addMessageToActiveChat]
  );

  return (
    <div className="h-screen w-screen flex bg-[#08090d] text-slate-100 overflow-hidden font-sans">
      {/* ── Collapsible Left Sidebar ─────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        sessions={sessions}
        activeId={activeId}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
        watchlistCount={watchlist.length}
        onOpenWatchlist={() => setWatchlistOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* ── Main Chat Area Layout Workspace ───────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-full p-2 sm:p-3 md:p-4 bg-[#08090d]">
        {/* Elevated Workspace Enclosure Box */}
        <main className="flex-1 flex flex-col min-w-0 h-full chat-workspace relative overflow-hidden">
          {/* Header Bar */}
          <Header
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            activeChat={activeSession}
            onRenameChat={renameChat}
            watchlistCount={watchlist.length}
            onOpenWatchlist={() => setWatchlistOpen(true)}
            onOpenShare={() => setShareOpen(true)}
          />

          {/* Chat Container Area */}
          <div className="flex-1 min-h-0 relative">
            <ChatContainer
              messages={activeSession?.messages || []}
              loading={loading}
              error={error}
              onSend={handleSendMessage}
              onRetry={() => {
                const msgs = activeSession?.messages || [];
                const lastUserMsg = [...msgs]
                  .reverse()
                  .find((m) => m.sender === "user");
                if (lastUserMsg) handleSendMessage(lastUserMsg.text);
              }}
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onMovieClick={(id) => setModalMovieId(id)}
            />
          </div>
        </main>
      </div>

      {/* ── Slide-over Watchlist Library Panel ────────────── */}
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

      {/* ── Settings Modal ───────────────────────────────── */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* ── Share Modal ──────────────────────────────────── */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        chatTitle={activeSession?.title || "MovieChat"}
      />

      {/* ── Full Movie Details Modal ─────────────────────── */}
      {modalMovieId && (
        <MovieModal
          movieId={modalMovieId}
          onClose={() => setModalMovieId(null)}
          isInWatchlist={isInWatchlist(modalMovieId)}
          onToggleWatchlist={handleToggleWatchlist}
          onFindSimilar={(query) => {
            setModalMovieId(null);
            handleSendMessage(query);
          }}
        />
      )}
    </div>
  );
}
