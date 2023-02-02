import { Modal, Button, Card } from "react-bootstrap";
import React, { useState } from "react";
import { useMovieContext } from "../utils/MovieContext";
import Auth from '../utils/auth';

function MovieBox(props) {
  const [state, ] = useMovieContext();
  const { likedMovies, dislikedMovies } = state;
  const {
    movie,
    likeMovieHandler,
    dislikeMovieHandler
  } = props;

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);   

  return (
    movie
    ?  <Card className="card text-center bg-secondary mb-3">
          <div className="card-body">
            <img className="card-img-top" src={movie.poster} alt={`Poster ${movie.title}`} variant='top' />
            <div className="card-body">
              <button type="button" className="btn btn-dark" onClick={handleShow}>View More</button>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>{movie.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                  (movie.poster && <Modal.Img src={movie.poster} alt={`Poster ${movie.title}`} variant='top' />)
                  <h3>{movie.title}</h3>
                  <h4>IMDb: {movie.rating}</h4>
                  <h5>Release Date: {movie.release_date}</h5>
                  <br></br>
                  <h6>Overview</h6>
                  <p>{movie.overview}</p>
                </Modal.Body>

              {Auth.loggedIn()
              ?  <Modal.Footer>
                    <Button 
                      className="movie-box-button"
                      disabled={dislikedMovies?.some(dislikedMovie => dislikedMovie._id === movie._id)}
                      variant={dislikedMovies?.some(dislikedMovie => dislikedMovie._id === movie._id) ? "outline-secondary" : "outline-danger"}
                      onClick={() => dislikeMovieHandler(movie)}>
                                {dislikedMovies?.some(dislikedMovie => dislikedMovie._id === movie._id)
                                ? <span>Disliked!</span>
                                : <i className='far fa-thumbs-down fa-2x' />}
                    </Button>
                    <Button
                            className="movie-card-button"
                            disabled={likedMovies?.some(likedMovie => likedMovie._id === movie._id)}
                            variant={likedMovies?.some(likedMovie => likedMovie._id === movie._id) ? "outline-secondary" : "outline-success"}
                            onClick={() => likeMovieHandler(movie)}>
                                {likedMovies?.some(likedMovie => likedMovie._id === movie._id)
                                ? <span>Liked!</span>
                                : <i className='far fa-thumbs-up fa-2x' />}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>

                </Modal.Footer>
              : <Modal.Footer> Please login/signup </Modal.Footer>
              }

              </Modal>
              
          </div>
        </div>
      </Card>
    : null
  )
};
export default MovieBox;          