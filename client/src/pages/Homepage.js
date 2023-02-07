// import React, { useState, useEffect } from "react";
// import { Container, Jumbotron } from "react-bootstrap";
// import MovieBox from "../components/MovieBox";
// import tmdb from "../utils/tmdb";
// import Auth from "../utils/auth";

// const Homepage = () => {
//   const [movies, setMovies] = useState([]);

//   useEffect(() => {
//     const movieSearch = async () => {
//       const { data } = await tmdb.get("/movie/popular");
//       console.log(data);
//       setMovies(data.results);
//     };
//     movieSearch();
//   }, []);

//   return (
//     <>
//       {Auth.loggedIn() ? (
//         <Jumbotron className="center">
//             <h1>Welcome to Popcorn N Chill!</h1> 
//             <p>Search your next favorite movie and leave comments</p>
//         </Jumbotron>
//       ) : (
//         <h1 className="center">Please login to search for movies!</h1>
//       )}
//       <Container>
//         {movies.length > 0 ? (
//           <div className="container">
//             <div className="grid">
//               {movies.map((movieReq) => (
//                 <MovieBox key={movieReq.id} {...movieReq} />
//               ))}
//             </div>
//           </div>
//         ) : (
//           <h2>Sorry !! No Movies Found</h2>
//         )}
//       </Container>
//     </>
//   );
// };

// export default Homepage;
