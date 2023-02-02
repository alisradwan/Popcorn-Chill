import { useReducer } from "react";

import {
    ADD_MOVIES,
    UPDATE_MOVIES,
    UPDATE_MOVIE_PREF
} from '../utils/actions';

export const reducer = (state, action) => {
    switch (action.type) {
        case ADD_MOVIES:
            return { ...state, movies: [...state.movies, action.movie] }
        case UPDATE_MOVIES:
            return { ...state, movies: action.movies }
        case UPDATE_MOVIE_PREF:
            return { ...state, dislikedMovies: action.dislikedMovies, likedMovies: action.likedMovies }
        default:
            return state ? state : '';
    }
};

export function useMovieReducer(initialState) {
    return useReducer (reducer, initialState);
}