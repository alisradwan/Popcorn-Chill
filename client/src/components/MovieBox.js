import React, { useContext } from 'react';
import { Accordion, AccordionContext, Button, Card, ResponsiveEmbed, Row, Col } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { SINGLE_MOVIE } from '../utils/queries';
import { useMovieContext } from "../utils/GlobalState";

const MovieBox = (props) => {
    const [state, ] = useMovieContext();
    const {
        movie,
        displayTrailer,
        skipMovieHandler,
        displaySkip
    } = props;

    const { movieId } = useParams();
    const { loading, data } = useQuery(SINGLE_MOVIE, {
        variables: {
            movieId: movieId
        },
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    function ContextAwareToggle({ eventKey, callback }) {
        const currentEventKey = useContext(AccordionContext);
    
        const decoratedOnClick = useAccordionToggle(
            eventKey,
            () => callback && callback(eventKey),
        );
    
        const isCurrentEventKey = currentEventKey === eventKey;
      
        return (
            <Button
                variant="link"
                className={`link ${isCurrentEventKey ? 'text-muted' : '' }`}
                onClick={decoratedOnClick}
            >
                {isCurrentEventKey
                ?   <span className="small">Collapse <i className="fas fa-chevron-up"></i></span>
                :   <span className="small">Click for details <i className="fas fa-chevron-down"></i></span>
                }
            </Button>
        );
    }      

    return (
        movie
        ?   <Accordion>
            <Card>
                {displayTrailer && movie.trailer
                    ? <ResponsiveEmbed aspectRatio="16by9">
                        <iframe
                            title={movie._id}
                            width="560"
                            height="315"
                            src={movie.trailer}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen></iframe>
                    </ResponsiveEmbed>
                    : (movie.poster && <Card.Img src={movie.poster} alt={`The cover for ${movie.title}`} variant='top' />)
                }
                <Card.Body className='comments'>
                    <Card.Title>
                        {movie.title}
                    </Card.Title>
                    <Row>
                        <Col sm={6}>
                            { movie.rating >= 0
                            ?   <StarRatings
                                    rating={movie.rating/2}
                                    numberOfStars={5}
                                    name={`${movie._id}-rating`}
                                    starDimension="20px"
                                    starSpacing="1px"
                                />
                            :   null
                            }
                            <Card.Text className="small">
                            ({movie.voteCount?.toLocaleString()} ratings)
                            </Card.Text>
                        </Col>
                        <Col className="text-right">
                            <ContextAwareToggle eventKey={movie._id} />
                        </Col>
                    </Row>
                </Card.Body>
                    <Accordion.Collapse eventKey={movie._id}>
                        <Card.Body className='comments'>
                            <Card.Text>Plot Summary</Card.Text>
                            <Card.Text className='small'>{movie.overview}</Card.Text>
                            <Card.Text className='small'>Release Date: {movie.releaseDate}</Card.Text>
                            <Card.Text className='small'>
                                {`${movie.likedUsers.length} ${movie.likedUsers.length === 1 ? 'user' : 'users'} liked this movie`}
                            </Card.Text>
                        </Card.Body>
                    </Accordion.Collapse>
                   {displaySkip &&
                        <Card.Footer className="text-center">
                            <Button
                                className="movie-card-button"
                                size="lg"
                                onClick={skipMovieHandler}>
                                    Next Movie
                            </Button>
                        </Card.Footer>
                  }
                </Card>
            </Accordion>
        :   null
    )
}

export default MovieBox;