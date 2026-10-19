import React, { useState, useEffect, useMemo } from "react";
import SlideShow from "../SlideShow/SlideShow";
import { SkeletonRow } from "../Skeleton/SkeletonCard";
import { movieInstance } from "../../utility/MovieInstance";
import requests from "../../utility/MovieRequest";
import { fallbackMovies } from "../../utility/fallbackData";
import { getAIRecommendations } from "../../utility/recommendationEngine";
import { useWatchlist } from "../../context/WatchlistContext";
import styles from "./DisplayRow.module.css";

/**
 * Row configuration listing all TMDB categories
 */
const CATEGORIES = [
  { id: "popular", title: "Popular on Netflix", url: requests.fetchNetflixOriginals },
  { id: "trending", title: "Trending Now", url: requests.fetchTrending },
  { id: "top-rated", title: "Top Rated", url: requests.fetchTopRatedMovies },
  { id: "action", title: "Action Thrillers", url: requests.fetchActionMovies },
  { id: "comedy", title: "Comedies", url: requests.fetchComedyMovies },
  { id: "horror", title: "Horror Movies", url: requests.fetchHorrorMovies },
  { id: "romance", title: "Romance Movies", url: requests.fetchRomanceMovies },
  { id: "documentaries", title: "Documentaries", url: requests.fetchDocumentaries },
];

/**
 * DisplayRow Component
 * Orchestrates all movie rows, handles resilient API fetching,
 * loading skeletons, fallback states, and dynamic AI personalized recommendations.
 */
function DisplayRow({ onPlayMovie, onMoreInfo, onOpenAIExplanation }) {
  const { watchlist } = useWatchlist();
  const [movieRows, setMovieRows] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchAllRows() {
      setLoading(true);

      const fetchPromises = CATEGORIES.map(async (cat) => {
        try {
          const res = await movieInstance.get(cat.url);
          const results = res.data?.results || [];
          return {
            id: cat.id,
            movies: results.length > 0 ? results : fallbackMovies,
          };
        } catch (error) {
          console.warn(`Failed to fetch category "${cat.title}", using fallback:`, error.message);
          return {
            id: cat.id,
            movies: fallbackMovies,
          };
        }
      });

      const settled = await Promise.allSettled(fetchPromises);

      if (isMounted) {
        const rowsMap = {};
        settled.forEach((result) => {
          if (result.status === "fulfilled" && result.value) {
            rowsMap[result.value.id] = result.value.movies;
          }
        });
        setMovieRows(rowsMap);
        setLoading(false);
      }
    }

    fetchAllRows();

    return () => {
      isMounted = false;
    };
  }, []);

  // PRODUCTION FEATURE: AI Content-Based Personalization
  const aiRecommendations = useMemo(() => {
    const allFetched = Object.values(movieRows).flat();
    const catalog = allFetched.length > 0 ? allFetched : fallbackMovies;
    return getAIRecommendations(catalog, watchlist, 12);
  }, [movieRows, watchlist]);

  return (
    <div className={styles.displayRowContainer}>
      {loading ? (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : (
        <>
          {/* AI-Powered Personalized Recommendations Row */}
          {aiRecommendations && aiRecommendations.length > 0 && (
            <SlideShow
              key="ai-recommendations"
              categoryKey="ai"
              title="✨ Top Picks For You (AI Recommended)"
              movies={aiRecommendations}
              onPlayMovie={onPlayMovie}
              onMoreInfo={onMoreInfo}
              isAI={true}
              onOpenAIExplanation={onOpenAIExplanation}
            />
          )}

          {/* Standard Curated Category Rows */}
          {CATEGORIES.map((cat) => {
            const movies = movieRows[cat.id] || fallbackMovies;
            return (
              <SlideShow
                key={cat.id}
                categoryKey={cat.id}
                title={cat.title}
                movies={movies}
                onPlayMovie={onPlayMovie}
                onMoreInfo={onMoreInfo}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default DisplayRow;
