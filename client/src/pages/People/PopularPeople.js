import React, { useState, useEffect } from "react";
import PeopleBox from "./PeopleBox";
import tmdb from "../../utils/tmdb";

function PopularPeople() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const movieSearch = async () => {
      const { data } = await tmdb.get("/person/popular");
      console.log(data);
      setMovies(data.results);
    };
    movieSearch();
  }, []);

  return (
    <div>
      <h1 className="center">Popular People</h1>
      {movies.length > 0 ? (
        <div className="container">
          <div className="grid">
            {movies.map((movieReq) => (
              <PeopleBox key={movieReq.id} {...movieReq} />
            ))}
          </div>
        </div>
      ) : (
        <h2 className="errPage">Sorry !! No Movies Found</h2>
      )}
    </div>
  );
}

export default PopularPeople;
