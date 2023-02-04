const { User, Movie } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('movies')
                    .populate('dislikedMovies')
                    .populate('likedMovies');
                
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },

        // get all users
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('movies')
                .populate('dislikedMovies')
                .populate('likedMovies')
                .populate('Movie.dislikedUsers')
                .populate('Movie.likedUsers');
        },

        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('movies')
                .populate('dislikedMovies')
                .populate('likedMovies')
                .populate('Movie.dislikedUsers')
                .populate('Movie.likedUsers');
        },

        // get a movie by id
        movie: async (parent, { movieId }) => {
            return Movie.findOne({ _id: movieId })
                .select('-__v')
                .populate('dislikedUsers')
                .populate('likedUsers');
        },

        // get all movies
        movies: async () => {
            return Movie.find()
                .select('-__v')
                .populate('dislikedUsers')
                .populate('likedUsers');
        },

        // get user's movie
        movies: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Movie.find(params)
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
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
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

            throw new AuthenticationError('You need to be logged in!');
        },

        addMovie: async (parent, { input }) => {
            const movie = await Movie.findOneAndUpdate(
                { externalMovieId: input.externalMovieId },
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
            throw new AuthenticationError('You need to be logged in!')
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
            throw new AuthenticationError('You need to be logged in!')
        },

        addComment: async (parent, { movieId, body }, context ) => {
            if (context.user) {
                return Movie.findOneAndUpdate(
                    { _id: movieId },
                    {
                        $addToSet: {
                            comments: { body, author: context.user.username },
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
            }
            throw new AuthenticationError (" You need to be logged in! ");
        },

        removeComment: async (parent, { movieId, commentId }, context) => {
            if (context.user) {
                return Movie.findOneAndUpdate(
                    { _id: movieId },
                    {
                        $pull: {
                            comments: { _id: commentId, author: context.user.username },
                        },
                    },
                    { new: true }
                );
            }
            throw new AuthenticationError (" You need to be logged in! ");
        }
    }
};

module.exports = resolvers;