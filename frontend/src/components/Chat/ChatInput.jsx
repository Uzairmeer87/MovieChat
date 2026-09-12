import { useState, useRef, useEffect } from "react";
import { Send, Mic, Film, Search, Sparkles, Popcorn, ArrowUp } from "lucide-react";

export default function ChatInput({ onSend, loading }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Auto resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  function handleSend() {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTagClick(prefix) {
    setInput((prev) => {
      if (!prev) return prefix;
      return `${prev} ${prefix}`;
    });
    textareaRef.current?.focus();
  }

  return (
    <div className="sticky bottom-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-[#12141d] via-[#12141d]/90 to-transparent pt-6">
      <div className="max-w-4xl mx-auto">
        {/* Floating Glass Input Box */}
        <div className="glass-input-container rounded-2xl p-3 shadow-2xl border border-white/10 focus-within:border-orange-500/50 transition-all duration-300">
          {/* Multiline Text Input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask MovieChat anything… (e.g. 'Sci-fi movies directed by Nolan')"
            disabled={loading}
            rows={1}
            className="w-full bg-transparent px-3 py-1.5 text-sm sm:text-base text-white placeholder-slate-400 outline-none resize-none no-scrollbar min-h-[40px] disabled:opacity-50"
          />

          {/* Bottom Control Bar Inside Input */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 mt-1">
            {/* Quick Feature Shortcut Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => handleTagClick("Recommend movies like ")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
              >
                <Film className="w-3 h-3 text-orange-400" />
                <span>Movies</span>
              </button>

              <button
                type="button"
                onClick={() => handleTagClick("Search for ")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
              >
                <Search className="w-3 h-3 text-cyan-400" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={() => handleTagClick("Recommend top rated ")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Recommend</span>
              </button>

              <button
                type="button"
                onClick={() => handleTagClick("Movies for tonight")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
              >
                <Popcorn className="w-3 h-3 text-amber-400" />
                <span>Tonight</span>
              </button>
            </div>

            {/* Right Buttons: Mic + Send */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => {
                  alert("Voice search listening... Speak your query!");
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Voice Input"
              >
                <Mic className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shadow-md ${
                  input.trim() && !loading
                    ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-orange-950/50 scale-105"
                    : "bg-white/10 text-slate-500 cursor-not-allowed"
                }`}
                title="Send Message"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5 font-bold" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
