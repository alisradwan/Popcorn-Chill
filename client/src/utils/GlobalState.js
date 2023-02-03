import React, { createContext, useContext } from "react";
import { useMovieReducer } from './reducers';

const MovieContext = createContext();
const { Provider } = MovieContext;

const MovieProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useMovieReducer({
      likedMovies: [],  // array of movies that were liked
      dislikedMovies: [],  // array of movies that were disliked
      movies: []  // array of all movies
    });
    console.log({state}); // comment this in to test!
    return <Provider value={[state, dispatch]} {...props} />;
  };

const useMovieContext = () => {
    return useContext(MovieContext);
};

export { MovieProvider, useMovieContext };
