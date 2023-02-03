import React, { useEffect, useState } from 'react';
// Components
import { Form, Button, Container, Card} from 'react-bootstrap';
import MovieCard from '../components/MovieCard'
// TMDB API
import { searchMovie } from '../utils/tmdb';
// GraphQL
import { DISLIKE_MOVIE, LIKE_MOVIE } from '../utils/mutations';
import { GET_USER } from '../utils/queries';
import { useMutation, useQuery } from '@apollo/react-hooks';
// Global State
import { useMovieContext } from "../utils/MovieContext";
import { UPDATE_MOVIE_PREF } from '../utils/actions';
// IndexedDB
import { idbPromise } from "../utils/helpers";
import { findIndexByAttr } from '../utils/helpers'


const Dashboard = () => {
    // State
    const [state, dispatch] = useMovieContext();
    const { likedMovies, dislikedMovies } = state   
    const [searchInput, setSearchInput] = useState('');
    const [searchedMovies, setSearchedMovies] = useState([]);
  
    // GraphQL
    const [dislikeMovie] = useMutation(DISLIKE_MOVIE);
    const [likeMovie] = useMutation(LIKE_MOVIE);
    const { loading, data } = useQuery(GET_USER);

    // hook for updating movie preferences
    useEffect(() => {
        // if we're online, use server to update movie preferences
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
            // if we're offline, use idb to update movie preferences
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

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!searchInput) {
            return false;
        }
      try {
        const response = await searchMovie(searchInput);

        if (!response.ok) {
            throw new Error("Couldn't search for movies");
        }

        const { results } = await response.json();
        const movieData = results.map((movie) => ({
            externalMovieId: movie.id,
            rating: movie.vote_average,
            voteCount: movie.vote_count,
            title: movie.title,
            overview: movie.overview,
            releaseDate: movie.release_date,
            poster: 'https://image.tmdb.org/t/p/w500' + movie.poster_path
        }));
        console.log("List of searched " + movieData);
        setSearchedMovies(movieData);
        setSearchInput('');
      } catch (err) {
        console.error(err);
      }  
    };

    const handleLikeMovie = (likedMovie) => {
        // update the db
        likeMovie({
            variables: { movieId: likedMovie._id }
        })
        .then(({data}) => {
            console.log(data.likeMovie)
            if (data) {
                // update global state
                dispatch({
                    type: UPDATE_MOVIE_PREF,
                    likedMovies: data.likeMovie.likedMovies,
                    dislikedMovies: data.likeMovie.dislikedMovies
                });
    
                // find the updated movie
                const likedMovieIndex = findIndexByAttr(data.likeMovie.likedMovies, '_id', likedMovie._id);
                const updatedLikedMovie = data.likeMovie.likedMovies[likedMovieIndex];

                // update idb
                idbPromise('likedMovies', 'put', updatedLikedMovie);
                idbPromise('dislikedMovies', 'delete', updatedLikedMovie);
            } else {
                console.error("Couldn't like the movie!");
            }
        })
        .catch(err => console.error(err));
    };

    const handleDislikeMovie = (dislikedMovie) => {
        // update the db
        dislikeMovie({
            variables: { movieId: dislikedMovie._id }
        })
        .then(async ({data}) => {
            if (data) {
                // update global state
                dispatch({
                    type: UPDATE_MOVIE_PREF,
                    likedMovies: data.dislikeMovie.likedMovies,
                    dislikedMovies: data.dislikeMovie.dislikedMovies
                });
    
                // find the updated movie
                const dislikedMovieIndex = await findIndexByAttr(data.dislikeMovie.dislikedMovies, '_id', dislikedMovie._id);
                const updatedDislikedMovie = data.dislikeMovie.dislikedMovies[dislikedMovieIndex];
    
                // update idb
                idbPromise('likedMovies', 'delete', updatedDislikedMovie);
                idbPromise('dislikedMovies', 'put', updatedDislikedMovie);
            } else {
                console.error("Couldn't dislike the movie!");
            }
        })
        .catch(err => console.error(err));
    };

    return (
        <>
            <div fluid className="text-light bg-dark">
                <Container>
                    <Form onSubmit={(event) => handleFormSubmit(event, searchInput)}>
                        <Form.Label className="h3">Find your favorite movies</Form.Label>
                        <Form.Control
                            name='searchInput'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            type='text'
                            placeholder='Enter a movie name'
                        />
                        <Button type='submit' className="mt-2">Search</Button>
                    </Form>
                </Container>
            </div>
            <Container>
              {!searchedMovies.length
              ? <h2 className="results-heading">No movies found! Please try another search.</h2>
              : <>
                <h2 className="results-heading">{searchedMovies.length > 0 && `Viewing ${searchedMovies.length} results:`}</h2>                           
                <h2 className="results-heading">No movies found! Please try another search.</h2>
                <Card>
                  {searchedMovies?.map(movie => {
                    return (
                      <MovieCard
                      key={movie._id}
                      movie={movie}                                    
                      likeMovieHandler={handleLikeMovie}
                      dislikeMovieHandler={handleDislikeMovie}
                    />         
                    )
                  })}
                </Card>
                </>
                }    
            </Container>                
          </>                    
     );                                    
};                                    
                             
export default Dashboard;                            