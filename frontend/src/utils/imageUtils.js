/**
 * Helper to safely construct full TMDB image URLs or handle fallback URLs
 */
export function getMovieImageUrl(url, size = "w500") {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("/")) {
    return `https://image.tmdb.org/t/p/${size}${url}`;
  }
  return url;
}
