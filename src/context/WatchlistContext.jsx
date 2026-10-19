import React, { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem("netflix_watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("netflix_watchlist", JSON.stringify(watchlist));
    } catch (e) {
      console.warn("Could not save watchlist to localStorage", e);
    }
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    if (!movie || !movie.id) return;
    setWatchlist((prev) => {
      if (prev.some((item) => item.id === movie.id)) return prev;
      return [movie, ...prev];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== movieId));
  };

  const toggleWatchlist = (movie) => {
    if (!movie || !movie.id) return;
    if (isWatchlisted(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const isWatchlisted = (movieId) => {
    return watchlist.some((item) => item.id === movieId);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isWatchlisted,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
