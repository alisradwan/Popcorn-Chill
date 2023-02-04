import gql from 'graphql-tag';

export const GET_USER = gql`
  {
    me {
      _id
      username
      email
      friends {
        _id
      }
      likedMovies{
        _id
        externalMovieId
        rating
        voteCount
        title
        overview
        releaseDate
        poster
        trailer
        likedUsers {
          _id
          username
        }
        dislikedUsers {
          _id
          username
        }
      }
      dislikedMovies{
        _id
        externalMovieId
        rating
        voteCount
        title
        overview
        releaseDate
        poster
        trailer
        likedUsers {
          _id
          username
        }
        dislikedUsers {
          _id
          username
        }
      }
    }
  }
`;

export const SINGLE_MOVIE = gql `
query getSingleMovie($movieId: ID!) {
  movie(movieId: $movieId) {
    _id
    externalMovieId
    rating
    voteCount
    title
    overview
    releaseDate
    poster
    trailer
    likedUsers {
      _id
      username
    }
    dislikedUsers {
      _id
      username
    }
    comments {
      _id
      body
      author
      createdAt
    }
  }
}
`;

export const SINGLE_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      movies {
        _id
        externalMovieId
        rating
        voteCount
        title
        overview
        releaseDate
        poster
        trailer
        likedUsers {
          _id
          username
        }
        dislikedUsers {
          _id
          username
        }
        comments {
          _id
          body
          author
          createdAt
        }
      }
    }
  }
`