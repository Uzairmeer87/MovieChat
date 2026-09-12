import { Film, Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-6 animate-fade-in">
      <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[80%]">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-red-600 flex items-center justify-center text-white shrink-0 shadow-lg border border-white/10 mt-0.5">
          <Film className="w-4 h-4 animate-spin-slow" />
        </div>

        {/* Loading Bubble Container */}
        <div className="rounded-2xl rounded-tl-xs px-5 py-4 bg-[#171a26] border border-white/10 shadow-xl space-y-4 w-full">
          {/* Animated Dots & Label */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 items-center">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full typing-dot" style={{ animationDelay: "0ms" }} />
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full typing-dot" style={{ animationDelay: "200ms" }} />
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full typing-dot" style={{ animationDelay: "400ms" }} />
            </div>

            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              MovieChat is searching database & finding movies...
            </span>
          </div>

          {/* Skeleton Cards Preview */}
          <div className="flex gap-3 overflow-hidden no-scrollbar pt-1 opacity-60">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="w-[200px] shrink-0 h-[140px] rounded-2xl bg-white/5 border border-white/5 p-3 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="skeleton-box w-full h-16 rounded-xl" />
                <div className="space-y-1.5">
                  <div className="skeleton-box w-3/4 h-3 rounded" />
                  <div className="skeleton-box w-1/2 h-2.5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
