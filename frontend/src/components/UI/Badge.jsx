export default function Badge({ children, variant = "orange", className = "" }) {
  const variants = {
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    slate: "bg-white/5 text-slate-300 border-white/10",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
        variants[variant] || variants.orange
      } ${className}`}
    >
      {children}
    </span>
  );
}
