import React, { useEffect, useState } from 'react';
import { Form, Button, CardColumns, Container, Jumbotron } from 'react-bootstrap';
import MovieCard from '../components/MovieCard'
import { cleanMovieData } from '../utils/movieData';
import { searchTMDB } from '../utils/API';
import { ADD_MOVIE, DISLIKE_MOVIE, LIKE_MOVIE } from '../utils/mutations';
import { GET_USER } from '../utils/queries';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useMovieContext } from "../utils/GlobalState";
import { UPDATE_MOVIE_PREFERENCES } from '../utils/actions';
import { idbPromise } from "../utils/helpers";
import { findIndexByAttr } from '../utils/helpers'

const SearchMovies = () => {
    const [state, dispatch] = useMovieContext();
    const { likedMovies, dislikedMovies } = state
    const [resultsFound, setResultsFound] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [searchedMovies, setSearchedMovies] = useState([]);
    const [searching, setSearching] = useState(false);
    const [addMovie, { addMovieError }] = useMutation(ADD_MOVIE);
    const [dislikeMovie] = useMutation(DISLIKE_MOVIE);
    const [likeMovie] = useMutation(LIKE_MOVIE);
    const { loading, data } = useQuery(GET_USER);

    useEffect(() => {
        if (!likedMovies.length && !dislikedMovies.length) {
            if (data && data.me) {
                if (data.me.likedMovies.length || !data.me.dislikedMovies.length) {
                    console.log("Online!")
                    dispatch({
                        type: UPDATE_MOVIE_PREFERENCES,
                        likedMovies: data.me.likedMovies,
                        dislikedMovies: data.me.dislikedMovies
                    });
                }
            }

            else if (!loading) {
                idbPromise('likedMovies', 'get').then(likedMovies => {
                    idbPromise('dislikedMovies', 'get').then(dislikedMovies => {
                        if (dislikedMovies.length || likedMovies.length) {
                            console.log("Offline!")
                            dispatch({
                                type: UPDATE_MOVIE_PREFERENCES,
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
        setSearchedMovies([]);
        setSearching(true);
        if (!searchInput) {
            return false;
        }
        const response = await searchTMDB(searchInput);
        if (!response.ok) {
            throw new Error("Failed to search for movie!");
        }
        const { results } = await response.json();
        if (results.length === 0) {
            setResultsFound(false);
            setSearching(false);
            return;
        }
        const cleanedMovies = await cleanMovieData(results);
        const updatedSearchedMovies = [];
        for (let i=0; i < cleanedMovies.length; i++) {
            const { data } = await addMovie({
                variables: { input: cleanedMovies[i] }
            })
            if (!addMovieError) {
                updatedSearchedMovies.push(data.addMovie);
            }
        };
        setSearchedMovies(updatedSearchedMovies);
        setSearching(false);
        setResultsFound(true);
    };

    const handleLikeMovie = (likedMovie) => {
        likeMovie({
            variables: { movieId: likedMovie._id }
        })
        .then(({data}) => {
            console.log(data.likeMovie)
            if (data) {
                dispatch({
                    type: UPDATE_MOVIE_PREFERENCES,
                    likedMovies: data.likeMovie.likedMovies,
                    dislikedMovies: data.likeMovie.dislikedMovies
                });
    
                const likedMovieIndex = findIndexByAttr(data.likeMovie.likedMovies, '_id', likedMovie._id);
                const updatedLikedMovie = data.likeMovie.likedMovies[likedMovieIndex];
                idbPromise('likedMovies', 'put', updatedLikedMovie);
                idbPromise('dislikedMovies', 'delete', updatedLikedMovie);
            } else {
                console.error("Failed to like this movie!");
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
                    type: UPDATE_MOVIE_PREFERENCES,
                    likedMovies: data.dislikeMovie.likedMovies,
                    dislikedMovies: data.dislikeMovie.dislikedMovies
                });
                const dislikedMovieIndex = await findIndexByAttr(data.dislikeMovie.dislikedMovies, '_id', dislikedMovie._id);
                const updatedDislikedMovie = data.dislikeMovie.dislikedMovies[dislikedMovieIndex];
                idbPromise('likedMovies', 'delete', updatedDislikedMovie);
                idbPromise('dislikedMovies', 'put', updatedDislikedMovie);
            } else {
                console.error("Failed to dislike this movie");
            }
        })
        .catch(err => console.error(err));
    };

    return (
        <>
            <Jumbotron fluid className="text-light bg-dark">
                <Container>
                    <Form onSubmit={(event) => handleFormSubmit(event, searchInput)}>
                        <Form.Label className="h3">Find your next favorite movies</Form.Label>
                        <Form.Control
                            name='searchInput'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            type='text'
                            placeholder='Enter the movie name!'
                        />
                        <Button type='submit' className="mt-1">Search</Button>
                    </Form>
                </Container>
            </Jumbotron>
            <Container>
                {!searching && !resultsFound
                    ?   <h2 className="results-heading">No movies found! Please try another search.</h2>
                    :   <>
                            <h2 className="results-heading">
                                {searchedMovies.length > 0 && `Viewing ${searchedMovies.length} results:`}
                            </h2>
                            <CardColumns>
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
                            </CardColumns>
                        </>
                }
            </Container>
        </>
    );
};

export default SearchMovies;