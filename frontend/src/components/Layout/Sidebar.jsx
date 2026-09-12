import { useState } from "react";
import {
  Film,
  Plus,
  Compass,
  Sparkles,
  Grid,
  Bookmark,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronLeft,
  Trash2,
  Edit2,
  Check,
  X,
  User,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  onToggle,
  sessions = [],
  activeId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  watchlistCount = 0,
  onOpenWatchlist,
  onOpenSettings,
  activeNav = "home",
  setActiveNav,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  function handleStartRename(chat, e) {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  }

  function handleSaveRename(id, e) {
    e.stopPropagation();
    onRenameChat(id, editTitle);
    setEditingId(null);
  }

  function handleCancelRename(e) {
    e.stopPropagation();
    setEditingId(null);
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:relative z-40 top-0 bottom-0 left-0 flex flex-col bg-[#0c0e14] border-r border-white/10 transition-all duration-300 ease-in-out shrink-0 ${
          isOpen ? "w-[260px] translate-x-0" : "w-0 md:w-0 -translate-x-full md:translate-x-0 overflow-hidden"
        }`}
      >
        {/* ── Brand Header ────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-950/50">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-base tracking-tight font-outfit text-white">
                  MovieChat
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Movie Assistant</p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* ── Primary Action: + New Chat ───────────────── */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              setActiveNav("home");
            }}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-md shadow-orange-950/40 hover:shadow-orange-900/60 transition-all cursor-pointer group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Chat</span>
          </button>
        </div>

        {/* ── Scrollable Navigation & History ──────────── */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 custom-scrollbar">
          {/* Main Nav Items */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveNav("home");
                if (!isOpen) onToggle();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === "home"
                  ? "bg-white/10 text-white font-semibold border border-white/10 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Compass className="w-4 h-4 text-orange-400" />
              <span>Explore / Home</span>
            </button>

            <button
              onClick={() => {
                setActiveNav("discover");
                onNewChat();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === "discover"
                  ? "bg-white/10 text-white font-semibold border border-white/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Discover Movies</span>
            </button>

            <button
              onClick={() => {
                setActiveNav("categories");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeNav === "categories"
                  ? "bg-white/10 text-white font-semibold border border-white/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <Grid className="w-4 h-4 text-emerald-400" />
              <span>Categories</span>
            </button>

            <button
              onClick={onOpenWatchlist}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Library / Watchlist</span>
              </div>
              {watchlistCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5 pt-3">
            <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Recent Chats
            </h3>

            <div className="space-y-1">
              {sessions.map((chat) => {
                const isActive = chat.id === activeId;
                const isEditing = editingId === chat.id;

                return (
                  <div
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat.id);
                      setActiveNav("chat");
                    }}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-orange-500/10 text-white font-medium border border-orange-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <MessageSquare
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isActive ? "text-orange-400" : "text-slate-400"
                        }`}
                      />

                      {isEditing ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(chat.id, e);
                            if (e.key === "Escape") handleCancelRename(e);
                          }}
                          autoFocus
                          className="w-full bg-slate-900 text-white px-2 py-0.5 rounded outline-none border border-orange-500/50 text-xs"
                        />
                      ) : (
                        <span className="truncate">{chat.title}</span>
                      )}
                    </div>

                    {/* Chat Item Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={(e) => handleSaveRename(chat.id, e)}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={handleCancelRename}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => handleStartRename(chat, e)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"
                            title="Rename chat"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChat(chat.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded"
                            title="Delete chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Bottom Footer ────────────────────────────── */}
        <div className="p-3 border-t border-white/5 space-y-1 bg-[#090a0f]">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Help & FAQ</span>
          </a>

          {/* User Profile Card */}
          <div className="pt-2">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                <User className="w-4 h-4" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#090a0f]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">Movie Enthusiast</p>
                <p className="text-[10px] text-slate-400 truncate">Pro Member</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
