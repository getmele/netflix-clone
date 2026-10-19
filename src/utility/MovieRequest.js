/**
 * TMDB API endpoint paths for each movie & TV category
 */
const requests = {
  fetchTrending: "/trending/all/week",
  fetchNetflixOriginals: "/discover/tv?with_networks=213",
  fetchTopRatedMovies: "/movie/top_rated",
  fetchActionMovies: "/discover/movie?with_genres=28",
  fetchComedyMovies: "/discover/movie?with_genres=35",
  fetchHorrorMovies: "/discover/movie?with_genres=27",
  fetchRomanceMovies: "/discover/movie?with_genres=10749",
  fetchDocumentaries: "/discover/movie?with_genres=99",
  searchMovies: "/search/multi",
};

export default requests;
