const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Auth {
        token: ID!
        user: User
    }

    type Movie {
        _id: ID!
        movie_id: Int!
        poster: String
        adult: Boolean
        overview: String!
        release_date: String
        genres: [String]
        title: String!
        rating: Float
        vote_count: Int
        runtime: Int
        trailer: String
        homepage: String
        likedUsers: [User]
        dislikedUsers: [User]
        comments: [Comment]!
    }

    type Comment {
        _id: ID!
        commentText: String!
        commentAuthor: String!
        createdAt: String
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        friendCount: Int
        friends: [User]
        likedMovies: [Movie]
        dislikedMovies: [Movie]
    }

    input MovieInput {
        movie_id: Int
        poster: String
        adult: Boolean
        overview: String!
        release_date: String
        genres: [String]
        title: String!
        rating: Float
        vote_count: Int
        runtime: Int
        trailer: String
        homepage: String
    }

    type Query {
        me: User
        movies: [Movie]
        movie(movieId: ID!): Movie
        users: [User]
        user(username: String!): User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addFriend(friendId: ID!): User
        addMovie(input: MovieInput!): Movie
        likeMovie(movieId: ID!): User
        dislikeMovie(movieId: ID!): User
        addComment(movieId: ID!, commentText: String!): Movie
        removeComment(movieId: ID!, commentId: ID!): Movie
    }
`;

module.exports = typeDefs;