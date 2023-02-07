import {
  Accordion,
  Button,
  Card,
  Row,
  Col,
  AccordionContext,
  Modal,
} from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap/AccordionButton";

import React, { useContext, useState } from "react";
import Auth from "../utils/auth";
import { useMovieContext } from "../utils/MovieContext";

function MovieCard(props) {
  const [state] = useMovieContext();
  const { likedMovies, dislikedMovies } = state;
  const { movie, likeMovieHandler, dislikeMovieHandler } = props;

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );
    return (
      <button type="button" onClick={decoratedOnClick}>
        {children}
      </button>
    );
  }

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return movie ? (
    <Accordion>
      <Card className="card text-center bg-secondary mb-3">
        <div className="card-body">
          <Card.Img
            className="card-img-top"
            src={movie.poster}
            alt={`Poster ${movie.title}`}
            variant="top"
          />
          <div className="card-body">
            <button type="button" className="btn btn-dark" onClick={handleShow}>
              View More
            </button>
            <Modal size="lg" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="center">
                  <h1>{movie.title}</h1>
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <Row>
                  <Col sm={5}>
                    <Card.Img
                      className="card-img-top img"
                      src={movie.poster}
                      alt={`Poster ${movie.title}`}
                      variant="top"
                    />
                  </Col>
                  <Col sm={7}>
                    <Card.Text className="lg">
                      {movie.voteCount?.toLocaleString()} IMDb:
                      {movie.rating >= 0 ? movie.rating : null}
                    </Card.Text>
                    <Card.Body>
                      <Card.Text>Plot Summary</Card.Text>
                      <Card.Text className="small">{movie.overview}</Card.Text>
                      <Card.Text>Release Date: {movie.release_date}</Card.Text>
                      <Card.Text className="lg">
                        {`${movie.likedUsers.length} ${
                          movie.likedUsers.length === 1 ? "user" : "users"
                        } liked this movie`}
                      </Card.Text>
                    </Card.Body>
                    {Auth.loggedIn() ? (
                      <Card.Footer>
                        <Button
                          className="movie-box-button"
                          disabled={dislikedMovies?.some(
                            (dislikedMovie) => dislikedMovie._id === movie._id
                          )}
                          variant={
                            dislikedMovies?.some(
                              (dislikedMovie) => dislikedMovie._id === movie._id
                            )
                              ? "outline-secondary"
                              : "outline-danger"
                          }
                          onClick={() => dislikeMovieHandler(movie)}
                        >
                          {dislikedMovies?.some(
                            (dislikedMovie) => dislikedMovie._id === movie._id
                          ) ? (
                            <span>Disliked!</span>
                          ) : (
                            <i className="far fa-thumbs-down fa-2x" />
                          )}
                        </Button>
                        <Button
                          className="movie-card-button"
                          disabled={likedMovies?.some(
                            (likedMovie) => likedMovie._id === movie._id
                          )}
                          variant={
                            likedMovies?.some(
                              (likedMovie) => likedMovie._id === movie._id
                            )
                              ? "outline-secondary"
                              : "outline-success"
                          }
                          onClick={() => likeMovieHandler(movie)}
                        >
                          {likedMovies?.some(
                            (likedMovie) => likedMovie._id === movie._id
                          ) ? (
                            <span>Liked!</span>
                          ) : (
                            <i className="far fa-thumbs-up fa-2x" />
                          )}
                        </Button>
                      </Card.Footer>
                    ) : (
                      <Card.Footer> Please login/signup </Card.Footer>
                    )}
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </Card>
    </Accordion>
  ) : null;
}
export default MovieCard;
