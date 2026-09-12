import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

export default function MovieCarousel({
  movies = [],
  isInWatchlist,
  onToggleWatchlist,
  onMovieClick,
}) {
  const containerRef = useRef(null);

  function scroll(direction) {
    if (!containerRef.current) return;
    const scrollAmount = direction === "left" ? -340 : 340;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative group/carousel my-3">
      {/* Left Scroll Button */}
      {movies.length > 2 && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100 hover:scale-110 transition-all cursor-pointer backdrop-blur-md"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Right Scroll Button */}
      {movies.length > 2 && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-xl opacity-0 group-hover/carousel:opacity-100 hover:scale-110 transition-all cursor-pointer backdrop-blur-md"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar scroll-smooth"
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id || index}
            className="shrink-0 w-[240px] sm:w-[260px] animate-fade-in"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <MovieCard
              movie={movie}
              rank={index + 1}
              isInWatchlist={isInWatchlist?.(movie.id)}
              onToggleWatchlist={() => onToggleWatchlist?.(movie)}
              onClick={() => onMovieClick?.(movie.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
