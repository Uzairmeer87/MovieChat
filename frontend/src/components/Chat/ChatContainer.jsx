import { useRef, useEffect } from "react";
import WelcomeScreen from "./WelcomeScreen";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssistantMessage";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ChatContainer({
  messages = [],
  loading,
  error,
  onSend,
  onRetry,
  isInWatchlist,
  onToggleWatchlist,
  onMovieClick,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Scrollable Message Workspace Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 custom-scrollbar">
        {messages.length === 0 ? (
          <WelcomeScreen onSelectQuery={onSend} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, index) => {
              if (msg.sender === "user") {
                return (
                  <UserMessage
                    key={index}
                    text={msg.text}
                    timestamp={msg.timestamp}
                  />
                );
              }

              return (
                <AssistantMessage
                  key={index}
                  text={msg.text}
                  movies={msg.movies}
                  searchMeta={msg.searchMeta}
                  isNew={msg.isNew}
                  isInWatchlist={isInWatchlist}
                  onToggleWatchlist={onToggleWatchlist}
                  onMovieClick={onMovieClick}
                  onRetry={() => {
                    const prevUserMsg = messages
                      .slice(0, index)
                      .reverse()
                      .find((m) => m.sender === "user");
                    if (prevUserMsg) onSend(prevUserMsg.text);
                  }}
                />
              );
            })}

            {/* Loading Indicator */}
            {loading && <TypingIndicator />}

            {/* Error Card */}
            {error && (
              <div className="flex justify-start mb-6 animate-fade-in">
                <div className="rounded-2xl px-5 py-4 bg-red-500/10 border border-red-500/20 text-red-200 max-w-md space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-red-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Something went wrong while finding movies.</span>
                  </div>
                  <p className="text-xs text-red-300/80 leading-relaxed">
                    Make sure the backend server is running and your connection is stable.
                  </p>
                  <button
                    onClick={onRetry}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Floating Bottom Input Bar */}
      <ChatInput onSend={onSend} loading={loading} />
    </div>
  );
}
