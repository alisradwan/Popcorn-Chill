// Using https://www.themoviedb.org/ for movies api
const api_key = "4d52fdbd34886b23d23b1968542bb378"

export const searchTMDB = (query) => {
    return fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}`);
};

export const getVideos = (movie_id) => {
    return fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${api_key}&language=en-US`)
};

// time_window can be by day or week
export const getTrendingMovies = (time_window) => {
    return fetch(`https://api.themoviedb.org/3/trending/movie/${time_window}?api_key=${api_key}`);
};

// category can be top_rated, latest, popular
export const getMovies = (category) => {
    return fetch(`https://api.themoviedb.org/3/movie/${category}?api_key=${api_key}&language=en-US`);
};