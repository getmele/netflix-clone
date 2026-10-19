import React, { useState, useEffect } from "react";
import { Play, Info } from "lucide-react";
import { movieInstance, BANNER_BASE } from "../../utility/MovieInstance";
import requests from "../../utility/MovieRequest";
import { fallbackBanner } from "../../utility/fallbackData";
import styles from "./Banner.module.css";

/**
 * Banner / Hero Section Component
 * Displays a featured cinematic movie/series backdrop with title,
 * synopsis overview, and interactive Play / More Info actions.
 */
function Banner({ onPlayMovie, onMoreInfo }) {
  const [movie, setMovie] = useState(fallbackBanner);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchBannerMovie() {
      try {
        setLoading(true);
        const response = await movieInstance.get(requests.fetchNetflixOriginals);
        const results = response.data?.results;

        if (results && results.length > 0 && isMounted) {
          // Select a random movie with a valid backdrop
          const withBackdrop = results.filter((item) => item.backdrop_path);
          const chosenList = withBackdrop.length > 0 ? withBackdrop : results;
          const randomMovie =
            chosenList[Math.floor(Math.random() * chosenList.length)];
          setMovie(randomMovie);
        }
      } catch (error) {
        console.warn("Banner API fetch failed, using fallback featured banner:", error);
        if (isMounted) {
          setMovie(fallbackBanner);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBannerMovie();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Truncate long descriptions gracefully
   */
  const truncate = (text, maxLength = 160) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength - 1) + "…"
      : text;
  };

  // Determine background image URL (TMDB path vs local fallback image)
  const bgImage = movie?.backdrop_path
    ? movie.backdrop_path.startsWith("http") || movie.backdrop_path.startsWith("/src") || movie.backdrop_path.startsWith("data:")
      ? movie.backdrop_path
      : `${BANNER_BASE}${movie.backdrop_path}`
    : fallbackBanner.backdrop_path;

  const displayTitle =
    movie?.title || movie?.name || movie?.original_name || "Featured Title";

  return (
    <section
      className={styles.banner}
      style={{
        backgroundImage: `url("${bgImage}")`,
      }}
      aria-label="Featured content banner"
    >
      {/* Side Vignette Overlay */}
      <div className={styles.bannerOverlay} />

      {/* Hero Content: Left-aligned and close to the bottom */}
      <div className={styles.content}>
        {/* Netflix Brand Tag */}
        <div className={styles.brandBadge}>
          <span>NETFLIX</span>
          <span className={styles.seriesTag}>SERIES</span>
        </div>

        {/* Banner Title */}
        <h1 className={styles.title}>{displayTitle}</h1>

        {/* Synopsis Overview */}
        <p className={styles.description}>
          {truncate(movie?.overview, 180)}
        </p>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.playButton}
            onClick={() => onPlayMovie && onPlayMovie(movie)}
            aria-label={`Play ${displayTitle}`}
          >
            <Play size={22} fill="currentColor" />
            <span>Play</span>
          </button>

          <button
            className={styles.infoButton}
            onClick={() => onMoreInfo && onMoreInfo(movie)}
            aria-label={`More info about ${displayTitle}`}
          >
            <Info size={22} />
            <span>More Info</span>
          </button>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className={styles.fadeBottom} />
    </section>
  );
}

export default Banner;
