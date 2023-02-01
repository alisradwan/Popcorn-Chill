import React, { useState, useEffect } from "react";
import MovieBox from "./MovieBox";
import SearchMovie from "./Searchmovie";

function TopMovies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("wwe");

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=4d52fdbd34886b23d23b1968542bb378&language=en-US&page=1&include_adult=false&query=${searchTerm}`
    )
      .then((response) => response.json())
      .then((data) => setMovies(data.results));
  }, [searchTerm]);

  return (
    <>
      <SearchMovie setSearchTerm={setSearchTerm} />

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
    </>
  );
}

export default TopMovies;
