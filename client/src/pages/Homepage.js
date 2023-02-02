import React, { useState, useEffect } from "react";
import MovieBox from "../components/MovieBox";
import tmdb from "../Api/tmdb";
import { useMovieContext } from "../utils/MovieContext";
import { ADD_MOVIES, UPDATE_MOVIE_PREF, UPDATE_MOVIES } from '../utils/actions';
import { ADD_MOVIE, DISLIKE_MOVIE, LIKE_MOVIE } from '../utils/mutations';
import { GET_USER } from '../utils/queries';
import { useMutation, useQuery } from "@apollo/client";
import Auth from '../utils/auth';

function Homepage() {
  const [state, dispatch] = useMovieContext();
  const { movies, likedMovies, dislikedMovies } = state
  const [movieIndex, setMovieIndex] = useState('');
  
  const [addMovie, { addMovieError }] = useMutation(ADD_MOVIE);
  const [dislikeMovie] = useMutation(DISLIKE_MOVIE);
  const [likeMovie] = useMutation(LIKE_MOVIE);
  const { loading, data } = useQuery(GET_USER);

  useEffect(() => {
      if (!likedMovies.length && !dislikedMovies.length) {
        if (data && data.me) {
          if (data.me.likedMovies.length || !data.me.dislikedMovies.length) {
            console.log("Online, using data from server to update movie preferences")
            dispatch({
                type: UPDATE_MOVIE_PREF,
                likedMovies: data.me.likedMovies,
                dislikedMovies: data.me.dislikedMovies
            });
          }
        }
         
      else if (!loading) {
        idbPromise('likedMovies', 'get').then(likedMovies => {
          idbPromise('dislikedMovies', 'get').then(dislikedMovies => {
            if (dislikedMovies.length || likedMovies.length) {
                console.log("Offline, using data from idb to update movie preferences")
                dispatch({
                    type: UPDATE_MOVIE_PREF,
                    likedMovies,
                    dislikedMovies
                })
              }
            })
          })
        }
      }
    }, [data, loading, likedMovies, dislikedMovies, dispatch])

  useEffect(() => {
    if (movies.length && movieIndex === '') {
      console.log('There are movies, but no movieIndex. Setting movieIndex')
      if (Auth.loggedIn()){
        for (let i=0; i < movies.length; i++) {
          const isLiked = likedMovies.some(likedMovie => likedMovie._id === movies[i]._id);
          const isDisliked = dislikedMovies.some(dislikedMovie => dislikedMovie._id === movies[i]._id);
          if (!isLiked && !isDisliked && movies[i].trailer) {
              setMovieIndex(i);
              break;
          }
        }
      }
      else {
          setMovieIndex(0);
      }
    }
  }, [setMovieIndex, dislikedMovies, likedMovies, movies, movieIndex]);

  const handleLikeMovie = (likedMovie) => {
    likeMovie({
        variables: { movieId: likedMovie._id }
    })
    .then(({data}) => {
        console.log(data.likeMovie)
        if (data) {
            dispatch({
                type: UPDATE_MOVIE_PREF,
                likedMovies: data.likeMovie.likedMovies,
                dislikedMovies: data.likeMovie.dislikedMovies
            });

            const likedMovieIndex = findIndexByAttr(data.likeMovie.likedMovies, '_id', likedMovie._id);
            const updatedLikedMovie = data.likeMovie.likedMovies[likedMovieIndex];

            idbPromise('likedMovies', 'put', updatedLikedMovie);
            idbPromise('dislikedMovies', 'delete', updatedLikedMovie);
        } else {
            console.error("Couldn't like the movie!");
        }
    })
    .catch(err => console.error(err));
  };

  const handleDislikeMovie = (dislikedMovie) => {
    dislikeMovie({
        variables: { movieId: dislikedMovie._id }
    })
    .then(async ({data}) => {
        if (data) {           
          dispatch({
              type: UPDATE_MOVIE_PREF,
              likedMovies: data.dislikeMovie.likedMovies,
              dislikedMovies: data.dislikeMovie.dislikedMovies
          });
          const dislikedMovieIndex = await findIndexByAttr(data.dislikeMovie.dislikedMovies, '_id', dislikedMovie._id);
          const updatedDislikedMovie = data.dislikeMovie.dislikedMovies[dislikedMovieIndex];

          idbPromise('likedMovies', 'delete', updatedDislikedMovie);
          idbPromise('dislikedMovies', 'put', updatedDislikedMovie);

        } else {
            console.error("Couldn't dislike the movie!");
        }
    })
    .catch(err => console.error(err));
  };

  return (
    <div>
      {movies.length > 0 
      ? (
        <div className="container">
          <div className="grid">
            {movies.map((movieReq) => (
              <MovieBox 
                key={movieReq.id} {...movieReq}
                movie={movies[movieIndex]}
                likeMovieHandler={handleLikeMovie}
                dislikeMovieHandler={handleDislikeMovie}
              />
            ))}
          </div>
        </div>
      ) 
      : (
        <h2>Sorry !! No Movies Found</h2>
      )}
    </div>
  );
}

export default Homepage;
