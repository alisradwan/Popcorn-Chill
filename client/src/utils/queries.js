import { gql } from '@apollo/client';

export const GET_USER = gql`
    {
        me {
            _id
            username
            email
            friends {
              _id
            }
            likedMovies {
              _id
              movie_id
              genres
              homepage
              adult
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
              dislikedUsers {
                _id
                username
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