import { Modal, Button } from "react-bootstrap";
import React, { useState } from "react";
import { useMovieContext } from "../utils/MovieContext";
const API_IMG = "https://image.tmdb.org/t/p/w500/";

const MovieBox = (props) => {
  const [state, ] = useMovieContext();
  const { likedMovies, dislikedMovies } = state;
  const {
    title,
    poster_path,
    vote_average,
    release_date,
    overview,
    likeMovieHandler,
    dislikeMovieHandler
} = props;

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div className="card text-center bg-secondary mb-3">
      <div className="card-body">
        <img className="card-img-top" src={API_IMG + poster_path} />
        <div className="card-body">
          <button type="button" className="btn btn-dark" onClick={handleShow}>
            View More
          </button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                className="card-img-top"
                style={{ width: "14rem" }}
                src={API_IMG + poster_path}
              />
              <h3>{title}</h3>
              <h4>IMDb: {vote_average}</h4>
              <h5>Release Date: {release_date}</h5>
              <br></br>
              <h6>Overview</h6>
              <p>{overview}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="movie-card-button"
                disabled={dislikedMovies?.some(dislikedMovie => dislikedMovie._id === title._id)}
                variant={dislikedMovies?.some(dislikedMovie => dislikedMovie._id === title._id) ? "outline-secondary" : "outline-danger"}
                onClick={() => dislikeMovieHandler(title)}>
                    {dislikedMovies?.some(dislikedMovie => dislikedMovie._id === title._id)
                    ? <span>Disliked!</span>
                    : <i className='far fa-thumbs-down fa-2x' />}
              </Button>
              <Button
                className="movie-card-button"
                disabled={likedMovies?.some(likedMovie => likedMovie._id === title._id)}
                variant={likedMovies?.some(likedMovie => likedMovie._id === title._id) ? "outline-secondary" : "outline-success"}
                onClick={() => likeMovieHandler(title)}>
                    {likedMovies?.some(likedMovie => likedMovie._id === title._id)
                    ? <span>Liked!</span>
                    : <i className='far fa-thumbs-up fa-2x' />}
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default MovieBox;
