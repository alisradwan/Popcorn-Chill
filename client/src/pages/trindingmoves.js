import React, { useState, useEffect } from "react";
import MovieBox from "./MovieBox";
import tmdb from "../Api/tmdb";

function Trindingmoves() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const movieSearch = async () => {
      const { data } = await tmdb.get("/movie/popular");
      console.log(data);
      setMovies(data.results);
    };
    movieSearch();
  }, []);

  return (
    <div>
      {movies.length > 0 ? (
        <div className="container">
          <div className="grid">
            {movies.map((movieReq) => (
              <MovieBox key={movieReq.id} {...movieReq} />
            ))}
          </div>
        </div>
      ) : (
        <h2>Sorry !! No Movies Found</h2>
      )}
    </div>
  );
}

export default Trindingmoves;
