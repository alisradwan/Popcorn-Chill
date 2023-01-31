const { User, Movie } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const { ContextualizedTypeStats } = require('apollo-reporting-protobuf');

const resolvers = {
    Query: {
        // Get me
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('likedMovies')
                    .populate('dislikedMovies');
                return userData;
            }
            throw new AuthenticationError("You are not logged in!");
        },

        // Get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('dislikedMovies')
                .populate('likedMovies')
                .populate('Movie.dislikedUsers')
                .populate('Movie.likedUsers');
        },

        // Get a single user by username
        user: async (parent, {username}) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('dislikedMovies')
                .populate('likedMovies')
                .populate('Movie.dislikedUsers')
                .populate('Movie.likedUsers');
        },

        // Get all movies
        movies: async () => {
            return Movie.find()
                .select('-__v')
                .populate('dislikedUsers')
                .populate('likedUsers');
        },

        // Get a single movie by id
        movie: async (parent, {movieId}) =>{
            return Movie.findOne({ _id: movieId })
                .select('-__v')
                .populate('dislikedUsers')
                .populate('likedUsers');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("User is not found!")
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Password is not correct!")
            }
            const token = signToken(user);
            return { token, user };
        },

        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');
                return updatedUser;
            }
            throw new AuthenticationError("Please login to continue!");
        },

        addMovie: async (parent, { input }) => {
            const movie = await Movie.findOneAndUpdate(
                { movie_id: input.movie_id },
                input,
                { upsert: true, new: true }
            );
            return movie;
        },

        likeMovie: async (parent, { movieId }, context) => {
            if (context.user) {
                const updatedMovie = await Movie.findByIdAndUpdate(
                    { _id: movieId },
                    {
                        $addToSet: { likedUsers: context.user._id },
                        $pull: { dislikedUsers: context.user._id }
                    }
                )

                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: { likedMovies: updatedMovie._id },
                        $pull: { dislikedMovies: updatedMovie._id }
                    },
                    { new: true }
                )
                .populate('dislikedMovies')
                .populate('likedMovies')
                .populate('Movie.dislikedUsers')
                .populate('Movie.likedUsers');

                return updatedUser;
            }
            throw new AuthenticationError("Please login to continue!")
        },

        dislikeMovie: async (parent, { movieId }, context) => {
            if (context.user) {
                const updatedMovie = await Movie.findByIdAndUpdate(
                    { _id: movieId },
                    {
                        $addToSet: { dislikedUsers: context.user._id },
                        $pull: { likedUsers: context.user._id }
                    }
                )
                .populate('Movie.dislikedUsers')
                .populate('Movie.likedUsers')

                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: { dislikedMovies: updatedMovie._id },
                        $pull: { likedMovies: updatedMovie._id }
                    },
                    { new: true }
                )
                .populate('dislikedMovies')
                .populate('likedMovies');

                return updatedUser;
            }
            throw new AuthenticationError("Please login to continue!")
        },

        addComment: async (parent, { movieId, commentText }, context) => {
            if (context.user) {
                return Movie.findByIdAndUpdate(
                    { _id: movieId },
                    {
                        $addToSet: {
                            comments: { commentText, commentAuthor: context.user.username },
                        },
                    },
                    { new: true, runValidators: true },
                );
            }
            throw new AuthenticationError("Please login to continue!");
        },

        removeComment: async (parent, { movieId, commentId }, context) => {
            if (context.user) {
                return Movie.findByIdAndUpdate(
                    { _id: movieId },
                    {
                        $pull: {
                            comments: {
                                _id: commentId,
                                commentAuthor: context.user.username,
                            },
                        },
                    },
                    { new: true }
                );
            }
            throw new AuthenticationError("Please login to continue!");
        },
    }
};

module.exports = resolvers;