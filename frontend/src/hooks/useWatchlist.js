import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "moviebot_watchlist";

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage full or disabled — silently fail
  }
}

/**
 * Custom hook for managing a movie watchlist in localStorage.
 *
 * Returns:
 *   watchlist  — array of movie objects
 *   addMovie   — add a movie to the watchlist
 *   removeMovie — remove a movie by id
 *   isInWatchlist — check if a movie id is in the watchlist
 *   clearWatchlist — clear all movies
 */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(loadWatchlist);

  // Sync to localStorage whenever watchlist changes
  useEffect(() => {
    saveWatchlist(watchlist);
  }, [watchlist]);

  const addMovie = useCallback((movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [{ ...movie, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeMovie = useCallback((movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const isInWatchlist = useCallback(
    (movieId) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  return { watchlist, addMovie, removeMovie, isInWatchlist, clearWatchlist };
}
