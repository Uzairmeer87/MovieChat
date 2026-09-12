import { User } from "lucide-react";

export default function UserMessage({ text, timestamp }) {
  return (
    <div className="flex justify-end mb-4 animate-fade-in">
      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]">
        <div className="rounded-2xl rounded-br-xs px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-950/30 border border-orange-500/30">
          <p className="text-sm leading-relaxed whitespace-pre-line font-medium">{text}</p>

          {timestamp && (
            <p className="text-[10px] text-orange-200/70 text-right mt-1 font-mono">
              {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>

        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
          <User className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
