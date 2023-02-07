import React, { useState, useEffect } from "react";
import Movies from "../../components/Movies";
import tmdb from "../../utils/tmdb";
function UpComing() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const movieSearch = async () => {
      const { data } = await tmdb.get("/movie/upcoming");
      console.log(data);
      setMovies(data.results);
    };
    movieSearch();
  }, []);

  return (
    <div>
      <h3 className="center">Upcoming Movies</h3>
      {movies.length > 0 ? (
        <div className="container">
          <div className="grid">
            {movies.map((movieReq) => (
              <Movies key={movieReq.id} {...movieReq} />
            ))}
          </div>
        </div>
      ) : (
        <h2 className="errPage">Sorry !! No Movies Found</h2>
      )}
    </div>
  );
}

export default UpComing;
