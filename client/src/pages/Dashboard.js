import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { Form, Button, Container } from "react-bootstrap";
import { searchMovie } from "../utils/tmdb";
import { ADD_MOVIE, DISLIKE_MOVIE, LIKE_MOVIE } from "../utils/mutations";
import { GET_USER } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useMovieContext } from "../utils/MovieContext";
import { UPDATE_MOVIE_PREF } from "../utils/actions";
import { idbPromise, findIndexByAttr } from "../utils/helpers";
import { dataCleaner } from "../utils/dataCleaner";

function Dashboard() {
  const [state, dispatch] = useMovieContext();
  const { likedMovies, dislikedMovies } = state;
  const [results, setResults] = useState(true);
  const [searchInput, setSearchInput] = useState("");
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
          console.log(
            "Online, using data from server to update movie preferences"
          );
          dispatch({
            type: UPDATE_MOVIE_PREF,
            likedMovies: data.me.likedMovies,
            dislikedMovies: data.me.dislikedMovies,
          });
        }
      } else if (!loading) {
        idbPromise("likedMovies", "get").then((likedMovies) => {
          idbPromise("dislikedMovies", "get").then((dislikedMovies) => {
            if (dislikedMovies.length || likedMovies.length) {
              console.log(
                "Offline, using data from idb to update movie preferences"
              );
              dispatch({
                type: UPDATE_MOVIE_PREF,
                likedMovies,
                dislikedMovies,
              });
            }
          });
        });
      }
    }
  }, [data, loading, likedMovies, dislikedMovies, dispatch]);

  const handleLikeMovie = (likedMovie) => {
    likeMovie({
      variables: { movie_id: likedMovie._id },
    })
      .then(({ data }) => {
        console.log(data.likeMovie);
        if (data) {
          dispatch({
            type: UPDATE_MOVIE_PREF,
            likedMovies: data.likeMovie.likedMovies,
            dislikedMovies: data.likeMovie.dislikedMovies,
          });
          const likedMovieIndex = findIndexByAttr(
            data.likeMovie.likedMovies,
            "_id",
            likedMovie._id
          );
          const updatedLikedMovie = data.likeMovie.likedMovies[likedMovieIndex];
          idbPromise("likedMovies", "put", updatedLikedMovie);
          idbPromise("dislikedMovies", "delete", updatedLikedMovie);
        } else {
          console.error("Couldn't like the movie!");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleDislikeMovie = (dislikedMovie) => {
    dislikeMovie({
      variables: { movie_id: dislikedMovie._id },
    })
      .then(async ({ data }) => {
        if (data) {
          dispatch({
            type: UPDATE_MOVIE_PREF,
            likedMovies: data.dislikeMovie.likedMovies,
            dislikedMovies: data.dislikeMovie.dislikedMovies,
          });
          const dislikedMovieIndex = await findIndexByAttr(
            data.dislikeMovie.dislikedMovies,
            "_id",
            dislikedMovie._id
          );
          const updatedDislikedMovie =
            data.dislikeMovie.dislikedMovies[dislikedMovieIndex];
          idbPromise("likedMovies", "delete", updatedDislikedMovie);
          idbPromise("dislikedMovies", "put", updatedDislikedMovie);
        } else {
          console.error("Couldn't dislike the movie!");
        }
      })
      .catch((err) => console.error(err));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSearchedMovies([]);
    setSearching(true);
    if (!searchInput) {
      return false;
    }
    const response = await searchMovie(searchInput);
    if (!response.ok) {
      throw new Error("Searching Failed!");
    }
    const { results } = await response.json();
    if (results.length === 0) {
      setResults(false);
      setSearching(false);
      return;
    }

    const updatedData = await dataCleaner(results);
    const updatedSearchedMovies = [];
    for (let i = 0; i < updatedData.length; i++) {
      const { data } = await addMovie({
        variables: { input: updatedData[i] },
      });
      if (!addMovieError) {
        updatedSearchedMovies.push(data.addMovie);
      }
    }
    setSearchedMovies(updatedSearchedMovies);
    setSearching(false);
    setResults(true);
  };

  return (
    <>
      <Container>
        <Form onSubmit={(event) => handleFormSubmit(event, searchInput)}>
          <Form.Label className="h3">
            Search Your Next Favorite Movies
          </Form.Label>
          <Form.Control
            name="searchInput"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Enter Movie Name"
          />
          <Button type="submit" className="mt-2">
            Search
          </Button>
        </Form>
      </Container>
      <Container>
        {!searching && !results ? (
          <h2 className="results-heading">
            No movies found! Please try another search.
          </h2>
        ) : (
          <div>
            <h2 className="results-heading">
              {searchedMovies.length > 0 &&
                `Viewing ${searchedMovies.length} results:`}
            </h2>
            <div className="container">
              <div className="grid">
                {searchedMovies?.map((movie) => {
                  return (
                    <MovieCard
                      key={movie._id}
                      movie={movie}
                      likeMovieHandler={handleLikeMovie}
                      dislikeMovieHandler={handleDislikeMovie}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export default Dashboard;
