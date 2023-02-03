import { Accordion, Button, Card, Row, Col, AccordionContext } from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

import React, { useContext } from "react";
import Auth from '../utils/auth';
import { useMovieContext } from "../utils/MovieContext";


function MovieCard(props) {
  const [state, ] = useMovieContext();
  const { likedMovies, dislikedMovies } = state;
  const {
    movie,
    likeMovieHandler,
    dislikeMovieHandler
  } = props;

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!'),
    );
    return (
      <button
        type="button"
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }      

  return (
    movie
    ?  <Accordion>
        <Card className="card text-center bg-secondary mb-3">
          <div className="card-body">
            <Card.Img className="card-img-top" src={movie.poster} alt={`Poster ${movie.title}`} variant='top' />
            <div className="card-body">
                <Card.Body>                
                    <Card.Title>
                        {movie.title}
                    </Card.Title>
                    
                    <Row>
                        <Col sm={6}>
                            { movie.rating >= 0
                            ?   movie.rating
                            :   null
                            }
                            <Card.Text className="small">
                            ({movie.voteCount?.toLocaleString()} ratings)
                            </Card.Text>
                        </Col>
                        <Col className="text-right">
                            <CustomToggle eventKey={movie._id}>Show More</CustomToggle>
                        </Col>
                    </Row>
                  </Card.Body>  
                  
                  <Accordion.Collapse eventKey={movie._id}>
                        <Card.Body>
                            <Card.Text>Plot Summary</Card.Text>
                            <Card.Text className='small'>{movie.overview}</Card.Text>
                            <Card.Text className='small'>Release Date: {movie.releaseDate}</Card.Text>
                            <Card.Text className='small'>
                                {`${movie.likedUsers.length} ${movie.likedUsers.length === 1 ? 'user' : 'users'} liked this movie`}
                            </Card.Text>
                        </Card.Body>
                    </Accordion.Collapse>

              {Auth.loggedIn()
              ?  <Card.Footer>
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
                </Card.Footer>
              : <Card.Footer> Please login/signup </Card.Footer>
              }             
          </div>
        </div>
      </Card>
      </Accordion>
    : null
  )
};
export default MovieCard;          