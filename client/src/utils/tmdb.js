import axios from "axios";

export default axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Accept: "application/json",
  },
  params: {
    api_key: "4d52fdbd34886b23d23b1968542bb378",
  },
});

export const getPopularMovies = (time) => {
  return fetch(`https://api.themoviedb.org/3/trending/movie/${time}?api_key=4d52fdbd34886b23d23b1968542bb378`);
};