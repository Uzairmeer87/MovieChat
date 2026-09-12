import { useState } from "react";
import {
  Menu,
  MessageSquare,
  Edit2,
  Share2,
  Bookmark,
  Check,
  X,
  Sparkles,
} from "lucide-react";

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  activeChat,
  onRenameChat,
  watchlistCount = 0,
  onOpenWatchlist,
  onOpenShare,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(activeChat?.title || "MovieChat");

  function handleSaveRename() {
    if (activeChat?.id && title.trim()) {
      onRenameChat(activeChat.id, title.trim());
    }
    setIsEditing(false);
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 glass-header border-b border-white/10">
      {/* ── Left Side: Navigation toggle & Chat Title ── */}
      <div className="flex items-center gap-3 min-w-0">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            title="Open Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
          </div>

          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveRename();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                autoFocus
                className="bg-slate-900 text-white font-semibold text-sm px-2 py-1 rounded outline-none border border-orange-500/50"
              />
              <button
                onClick={handleSaveRename}
                className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0 group">
              <h2 className="font-bold text-sm sm:text-base text-white truncate font-outfit">
                {activeChat?.title || "Find a good movie"}
              </h2>
              <button
                onClick={() => {
                  setTitle(activeChat?.title || "");
                  setIsEditing(true);
                }}
                className="p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Rename title"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Side: Share, Watchlist, Settings ── */}
      <div className="flex items-center gap-2">
        {/* Share Button */}
        <button
          onClick={onOpenShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Watchlist Toggle */}
        <button
          onClick={onOpenWatchlist}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-gradient-to-r from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 border border-orange-500/20 transition-all cursor-pointer group"
        >
          <Bookmark className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Watchlist</span>
          {watchlistCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
              {watchlistCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
