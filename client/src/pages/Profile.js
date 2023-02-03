import React, { useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import MovieBox from "../components/MovieBox";
import { DISLIKE_MOVIE, LIKE_MOVIE } from "../utils/mutations";
import { GET_USER } from "../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import { useMovieContext } from "../utils/MovieContext";
import { UPDATE_MOVIE_PREF } from "../utils/actions";
import { idbPromise, findIndexByAttr } from "../utils/helpers";

function Profile() {
  const [state, dispatch] = useMovieContext();
  const { likedMovies, dislikedMovies } = state;
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

  return (
    <>
      <Container>
        <h2 className="pb-5">
          {likedMovies.length
            ? `You have ${likedMovies.length} liked ${
                likedMovies.length === 1 ? "movie" : "movies"
              }:`
            : "You have no liked movies!"}
        </h2>
      </Container>
      <Card>
        {likedMovies?.length && likedMovies.length > 0
          ? likedMovies.map((movie) => {
              return (
                <MovieBox
                  key={movie._id}
                  movie={movie}
                  likeMovieHandler={handleLikeMovie}
                  dislikeMovieHandler={handleDislikeMovie}
                />
              );
            })
          : null}
      </Card>
    </>
  );
}

export default Profile;
