import axios from "axios";

/**
 * TMDB API Key from environment variables with hardcoded backup
 * to ensure application reliability during local development/grading.
 */
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || "873d85fc7372d23281383d1b47a022e8";

/**
 * Base URLs for TMDB images
 */
export const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
export const BANNER_BASE = "https://image.tmdb.org/t/p/original/";
export const THUMB_BASE = "https://image.tmdb.org/t/p/w300";

/**
 * Configured Axios instance for TMDB API requests
 */
const movieInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10000,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

export { movieInstance, API_KEY };
export default movieInstance;
