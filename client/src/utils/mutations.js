import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
      token
      user {
          _id
          username
          email
          likedMovies {
              _id
              movie_id
              title
              overview
              release_date
              rating
              vote_count
              poster
              likedUsers {
                  _id
                  username
              }
          }
          dislikedMovies{
              _id
              movie_id
              title
              overview
              release_date
              rating
              vote_count
              poster
              likedUsers {
                  _id
                  username
              }
          }
      }
  }
}
`;
export const ADD_MOVIE = gql`
  mutation addMovie($input: MovieInput!) {
    addMovie(input:$input) {
        _id
        movie_id
        adult
        comments {
            _id
            commentAuthor
            commentText
        }
        genres
        homepage
        likedUsers {
            _id
            username
        }
        overview
        poster
        rating
        release_date
        title
        runtime
        trailer
        vote_count
    }
}
`;

export const LIKE_MOVIE = gql`
  mutation likeMovie($movieId: ID!) {
    likeMovie(movieId: $movieId) {
      id
      likedUsers {
        _id
        username
      }
      likeCount
    }
  }    
`;

export const DISLIKE_MOVIE = gql`
  mutation dislikeMovie($movieId: ID!) {
    dislikeMovie(movieId: $movieId) {
      likedMovies {
        _id
        movie_id
        adult
        genres
        homepage
        overview
        poster
        rating
        release_date
        runtime
        title
        trailer
        vote_count
        likedUsers {
          _id
          username
        }
      }
      dislikedMovies {
        _id
        movie_id
        adult
        genres
        homepage
        overview
        poster
        rating
        release_date
        runtime
        title
        trailer
        vote_count
        dislikedUsers {
          _id
          username
        }
      }
    }
  }  
`;

export const ADD_COMMENT = gql`
  mutation addComment($movieId: ID!, $commentText: String!) {
    addComment(movieId: $movieId, commentText: $commentText) {
      _id
      movie_id
      poster
      overview
      title
      comments {
        _id
        commentAuthor
        commentText
        createdAt
      }
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($movieId: ID!, $commentText: String!) {
    removeComment(movieId: $movieId, commentText: $commentText) {
      _id
      movie_id
      poster
      overview
      title
      comments {
        _id
        commentAuthor
        commentText
        createdAt
      }
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($friendId: ID!) {
    addFriend(friendId: $friendId) {
      _id
      friends {
        _id
        username
        likedMovies {
          _id
          movie_id
          title
          overview
          poster
        }
        friendCount
      }
      likedMovies {
        _id
        movie_id
        poster
        overview
        title
      }
      friendCount
      username
    }
  }
`;