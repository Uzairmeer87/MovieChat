import { useState } from "react";
import { X, Sliders, Moon, Zap, Shield, RefreshCw } from "lucide-react";

export default function SettingsModal({ isOpen, onClose }) {
  const [accent, setAccent] = useState("orange");
  const [autoScroll, setAutoScroll] = useState(true);
  const [typewriter, setTypewriter] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#131520] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white font-outfit">MovieChat Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Settings */}
        <div className="py-5 space-y-5">
          {/* Accent Color Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Theme Accent
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAccent("orange")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  accent === "orange"
                    ? "bg-orange-500/20 border-orange-500 text-orange-400 font-bold"
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                Cinematic Red
              </button>

              <button
                onClick={() => setAccent("purple")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  accent === "purple"
                    ? "bg-purple-500/20 border-purple-500 text-purple-400 font-bold"
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Neon Purple
              </button>

              <button
                onClick={() => setAccent("emerald")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                  accent === "emerald"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Cyber Green
              </button>
            </div>
          </div>

          {/* Toggle Typewriter effect */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <p className="text-sm font-semibold text-white">AI Typewriter Effect</p>
              <p className="text-xs text-slate-400">Stream response character by character</p>
            </div>
            <button
              onClick={() => setTypewriter(!typewriter)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                typewriter ? "bg-orange-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  typewriter ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Toggle Auto-scroll */}
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <p className="text-sm font-semibold text-white">Auto-Scroll Messages</p>
              <p className="text-xs text-slate-400">Automatically scroll to new AI responses</p>
            </div>
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                autoScroll ? "bg-orange-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoScroll ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 transition-all cursor-pointer shadow-md shadow-orange-950/40"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
