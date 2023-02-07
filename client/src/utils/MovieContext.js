import React, { createContext, useContext } from "react";
import { useMovieReducer } from './reducers';

const MovieContext = createContext();
const { Provider } = MovieContext;

const MovieProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useMovieReducer({
        likedMovies: [],
        dislikedMovies: [],
        movies: []
    });
    return <Provider value={[state, dispatch]} {...props} />; 
};

const useMovieContext = () => {
    return useContext(MovieContext);
};

export { MovieProvider, useMovieContext };