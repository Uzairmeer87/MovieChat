import MovieCard from "./MovieCard";

export default function MovieGrid({
  movies,
  onDetailsClick,
  onWatchlistToggle,
  isInWatchlist,
}) {
  if (!movies || movies.length === 0) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 12,
        marginTop: 12,
      }}
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onDetailsClick={onDetailsClick}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={isInWatchlist(movie.id)}
        />
      ))}
    </div>
  );
}
