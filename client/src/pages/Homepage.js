import React, { useEffect, useState } from 'react';
// Components
import { Container, Jumbotron, Form } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';
import MovieBox from '../components/MovieBox';
// TMDB API
import { getTrendingMovies, searchTMDB } from '../utils/API';
// GraphQL
import { ADD_MOVIE, DISLIKE_MOVIE, LIKE_MOVIE } from '../utils/mutations';
import { GET_USER } from '../utils/queries';
import { useMutation, useQuery } from '@apollo/react-hooks';
// Global State
import { useMovieContext } from "../utils/GlobalState";
import { ADD_TO_MOVIES, UPDATE_MOVIE_PREFERENCES, UPDATE_MOVIES } from '../utils/actions';
// IndexedDB
import { idbPromise } from "../utils/helpers";
import { cleanMovieData } from '../utils/movieData';
// Other Utils
import Auth from '../utils/auth';
import { findIndexByAttr } from '../utils/helpers'

function Home() {
  const [state, dispatch] = useMovieContext();
    const { movies, likedMovies, dislikedMovies } = state
    const [movieIndex, setMovieIndex] = useState('');
    // GraphQL
    const [addMovie, { addMovieError }] = useMutation(ADD_MOVIE);
    const [dislikeMovie] = useMutation(DISLIKE_MOVIE);
    const [likeMovie] = useMutation(LIKE_MOVIE);
    const { loading, data } = useQuery(GET_USER);
    const [resultsFound, setResultsFound] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [searchedMovies, setSearchedMovies] = useState([]);
    const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!likedMovies.length && !dislikedMovies.length) {
      if (data && data.me) {
        if (data.me.likedMovies.length || !data.me.dislikedMovies.length) {
          console.log(
            "Online, using data from server to update movie preferences"
          );
          dispatch({
            type: UPDATE_MOVIE_PREFERENCES,
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
                type: UPDATE_MOVIE_PREFERENCES,
                likedMovies,
                dislikedMovies,
              });
            }
          });
        });
      }
    }
  }, [data, loading, likedMovies, dislikedMovies, dispatch]);

  useEffect(() => {
    if (movies.length && movieIndex === '') {// show the next movie
        console.log('There are movies, but no movieIndex. Setting movieIndex')
        // if they're logged in, set it to the first movie they haven't actioned
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
        // if they're logged in, set it to the first movie in the deck
        else {
            setMovieIndex(0);
        }
    }
  }, [setMovieIndex, dislikedMovies, likedMovies, movies, movieIndex]);

  useEffect(() => {
    if (!movies.length) {
      // if we're online, ping the API to get our movie preferences
      try {
          console.log("Pinging TMDB API to get trending movies");
          getTrendingMovies('week').then(res => {
              if (res.ok) {
                  res.json().then(async ({ results }) => {
                      
                      const cleanedMovieData = await cleanMovieData(results);
                      cleanedMovieData.forEach(async movie => {
                          // add the movie to the db
                          const result = await addMovie({ variables: { input: movie } })

                          if (addMovieError) {
                              throw new Error("Couldn't add movie");
                          }

                          const { data: newMovieData } = await result;
                          const { addMovie : newMovie } = await newMovieData;

                          // add the movie to the global store
                          dispatch({
                              type: ADD_TO_MOVIES,
                              movie: newMovie
                          })

                          // add to idb
                          idbPromise('movies', 'put', newMovie);
                      })
                  })
              }
              else {
                  throw new Error ("Couldn't load trending movies");
              }
          })
      }
      // if we can't load from TMDB, try getting them from idb
      catch {
          console.log("Couldn't get data from TMDB API. Using IDB to display movies.");

          idbPromise('movies', 'get').then(movies => {
              if (movies.length) {
                  console.log('Using IDB to get trending movies');
                  dispatch({
                      type: UPDATE_MOVIES,
                      movies
                  })
              }
          })
      }
  }
}, [movies, data, dispatch, loading, addMovie, addMovieError])

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
              type: UPDATE_MOVIE_PREFERENCES,
              likedMovies: data.likeMovie.likedMovies,
              dislikedMovies: data.likeMovie.dislikedMovies
          });

          // find the updated movie
          const likedMovieIndex = findIndexByAttr(data.likeMovie.likedMovies, '_id', likedMovie._id);
          const updatedLikedMovie = data.likeMovie.likedMovies[likedMovieIndex];

          // update idb
          idbPromise('likedMovies', 'put', updatedLikedMovie);
          idbPromise('dislikedMovies', 'delete', updatedLikedMovie);

          // skip to the next movie
          handleSkipMovie();
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
              type: UPDATE_MOVIE_PREFERENCES,
              likedMovies: data.dislikeMovie.likedMovies,
              dislikedMovies: data.dislikeMovie.dislikedMovies
          });

          // find the updated movie
          const dislikedMovieIndex = await findIndexByAttr(data.dislikeMovie.dislikedMovies, '_id', dislikedMovie._id);
          const updatedDislikedMovie = data.dislikeMovie.dislikedMovies[dislikedMovieIndex];

          // update idb
          idbPromise('likedMovies', 'delete', updatedDislikedMovie);
          idbPromise('dislikedMovies', 'put', updatedDislikedMovie);

          // skip to the next movie
          handleSkipMovie();
      } else {
          console.error("Couldn't dislike the movie!");
      }
    })
    .catch(err => console.error(err));
  };

  const handleSkipMovie = async () => {
    // put the current movie at the end of the array if it's not the only movie
    if (movies.length) {
        for (let i=movieIndex + 1; i < movies.length; i++) {
            const isLiked = likedMovies.some(likedMovie => likedMovie._id === movies[i]._id);
            const isDisliked = dislikedMovies.some(dislikedMovie => dislikedMovie._id === movies[i]._id);

            if (!isLiked && !isDisliked && movies[i].trailer) {
                setMovieIndex(i);
                break;
            }
        }
    }
    // if this is the only movie left, set moviesToDisplay to an empty array.
    else {
        setMovieIndex('')
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSearchedMovies([]);
    setSearching(true);
    if (!searchInput) {
      return false;
    }
    const response = await searchTMDB(searchInput);
    if (!response.ok) {
      throw new Error("Searching Failed!");
    }
    const { results } = await response.json();
    if (results.length === 0) {
      setResultsFound(false);
      setSearching(false);
      return;
    }

    const updatedData = await cleanMovieData(results);
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
    setResultsFound(true);
  };
  
  return (
    <>
      <section class="page-section" id="services">
        <div class="container">
          <div class="text-center">
            <h2 class="section-heading text-uppercase">Popcorn & Chill</h2>
            <h3 class="section-subheading text-muted">
              {" "}
              Your #1 Movie Database
            </h3>
          </div>
        
          <Container>
            <Form
              className="input-group rounded"
              onSubmit={(event) => handleFormSubmit(event, searchInput)}
            >
              <Form.Control
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                placeholder="Enter Movie Name"
              />
              <button class="input-group-text border-0" id="search-addon">
                <i class="fas fa-search"></i>
              </button>
            </Form>
          </Container>
          <Container>
            {!searching && !resultsFound ? (
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
          <div className="row text-center">
            <div className="col-md-4">
              <span className="fa-stack fa-4x">
                {/* <i class="fas fa-circle fa-stack-2x text-primary"></i>
                <i class="fas fa-shopping-cart fa-stack-1x fa-inverse"></i> */}
              </span>
              <h4 className="my-3">Search for Endless Movies</h4>
              <p className="text-muted">
                {" "}
                Using the Movie DB api you can search for millions of movies
                shows to find whatver you're looking for.
              </p>
            </div>
            <div className="col-md-4">
              <span className="fa-stack fa-4x">
                {/* <i class="fas fa-circle fa-stack-2x text-primary"></i>
                < class="fa-duotone fa-film fa-stack-1x fa-inverse"></i> */}
              </span>
              <h4 className="my-3">Create a profile to save your favorites</h4>
              <p className="text-muted">
                You can create a profile to add your favorite movies to your
                collection. From their you can like, dislike, and leave comments
                on films and shows.
              </p>
            </div>
            <div className="col-md-4">
              <span className="fa-stack fa-4x">
                {/* <i class="fas fa-circle fa-stack-2x text-primary"></i>
                <i class="fas fa-lock fa-stack-1x fa-inverse"></i> */}
              </span>
              <h4 className="my-3">See what people are watching now</h4>
              <p className="text-muted">
                {" "}
                Not only can you see what's trending, you can create a proflie
                to see what your friends are watching too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Portfolio Grid--> */}    
      <Container>
        <h2 className="section-heading text-uppercase center">Top Trending Movies In the Theater Right Now!</h2>
        <section className="page-section center" id="portfolio">
          {loading ? <h2>Loading....</h2> : null}
              {movies.length             
              ?   <MovieBox
                      movie={movies[movieIndex]}
                      displayTrailer
                      displaySkip
                      skipMovieHandler={handleSkipMovie}
                  />
              :  null
            }
        </section>
      </Container> 
      {/* <!-- About--> */}
      <section className="page-section" id="about">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Trending Now</h2>
            <h3 className="section-subheading text-muted">
              Here's What People Are Watching
            </h3>
          </div>
          <ul className="timeline">
            <li>
              <div className="timeline-image">
                <img
                  class="rounded-circle img-fluid"
                  src={require("../assets/img/d9nBoowhjiiYc4FBNtQkPY7c11H.jpg")}
                  alt="..."
                />
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h4>2022-12-28</h4>
                  <h4 class="subheading">M3GAN</h4>
                </div>
                <div className="timeline-body">
                  <p className="text-muted">
                    A brilliant toy company roboticist uses artificial
                    intelligence to develop M3GAN, a life-like doll programmed
                    to emotionally bond with her newly orphaned niece. But when
                    the doll's programming works too well, she becomes
                    overprotective of her new friend with terrifying results.
                  </p>
                </div>
              </div>
            </li>
            <li className="timeline-inverted">
              <div className="timeline-image">
                <img
                  className="rounded-circle img-fluid"
                  src={require("../assets/img/kuf6dutpsT0vSVehic3EZIqkOBt.jpg")}
                  alt="..."
                />
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h4>2022-12-07</h4>
                  <h4 className="subheading">Puss in Boots: The Last Wish</h4>
                </div>
                <div className="timeline-body">
                  <p className="text-muted">
                    Puss in Boots discovers that his passion for adventure has
                    taken its toll: He has burned through eight of his nine
                    lives, leaving him with only one life left. Puss sets out on
                    an epic journey to find the mythical Last Wish and restore
                    his nine lives.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="timeline-image">
                <img
                  className="rounded-circle img-fluid"
                  src={require("../assets/img/sv1xJUazXeYqALzczSZ3O6nkH75.jpg")}
                  alt="..."
                />
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h4>2022-11-09</h4>
                  <h5>Black Panther: Wakanda Forever</h5>
                </div>
                <div className="timeline-body">
                  <p className="text-muted">
                    Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje
                    fight to protect their nation from intervening world powers
                    in the wake of King T'Challa's death. As the Wakandans
                    strive to embrace their next chapter, the heroes must band
                    together with the help of War Dog Nakia and Everett Ross and
                    forge a new path for the kingdom of Wakanda.
                  </p>
                </div>
              </div>
            </li>
            <li className="timeline-inverted">
              <div className="timeline-image">
                <img
                  className="rounded-circle img-fluid"
                  src={require("../assets/img/z2nfRxZCGFgAnVhb9pZO87TyTX5.jpg")}
                  alt="..."
                />
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <h4>2023-01-20</h4>
                  <h4 class="subheading">JUNG_E</h4>
                </div>
                <div className="timeline-body">
                  <p className="text-muted">
                    On an uninhabitable 22nd-century Earth, the outcome of a
                    civil war hinges on cloning the brain of an elite soldier to
                    create a robot mercenary.
                  </p>
                </div>
              </div>
            </li>
            <li className="timeline-inverted">
              <div className="timeline-image">
                <h4>
                  Be Part
                  <br />
                  Of Our
                  <br />
                  Story!
                </h4>
              </div>
            </li>
          </ul>
        </div>
      </section>
      {/* <!-- Team--> */}
      <section className="page-section bg-light" id="team">
        <div className="container">
          <div className="text-center">
            <h2 className="section-heading text-uppercase">Our Amazing Team</h2>
            <h3 className="section-subheading text-muted">
              Here are the Developers Behind Popcorn & Chill
            </h3>
          </div>

          <div className="row">
            <div className="col-md-3">
              <div className="team-member">
                <h4>Selina Su</h4>
                <p class="text-muted">Full Stack Web Developer</p>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="https://github.com/fuuko08"
                  aria-label="Parveen Anand Twitter Profile"
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="https://www.linkedin.com/in/selina-su-437501144/"
                  aria-label="Parveen Anand LinkedIn Profile"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <h4>Ali Radwan</h4>
                <p className="text-muted">insert title</p>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="https://github.com/alisradwan"
                  aria-label="Diana Petersen Twitter Profile"
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Diana Petersen LinkedIn Profile"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <h4>D'Artagnan Hickey</h4>
                <p className="text-muted">insert title</p>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="https://github.com/SaintMartyrn"
                  aria-label="Larry Parker Twitter Profile"
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Larry Parker LinkedIn Profile"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <h4>Aram Ambartsumyan</h4>
                <p className="text-muted">insert title</p>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="https://github.com/AramA89"
                  aria-label="Larry Parker Twitter Profile"
                >
                  <i className="fab fa-github"></i>
                </a>
                <a
                  className="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Larry Parker LinkedIn Profile"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <p className="large text-muted">
                {" "}
                We are a group of fullstack developers from the 2023 UCLA Coding
                Bootcamp. Front end, back end, we can do it all!
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Clients--> */}
      <div className="py-5">
        <div className="container"></div>
      </div>
      {/* <!-- Contact--> */}
      {/* <video src={require("../assets/VideoBg.mp4")} autoPlay loop muted></video> */}
    </>
  );
}

export default Home;