const { Schema, model } = require('mongoose');

const movieSchema = new Schema(
    {
        externalMovieId: {
            type: Number,
            required: true,
            unique: true
        },
        rating: {
            type: Number,
        },
        voteCount: {
            type: Number,
        },
        title: {
            type: String,
            required: true,
        },
        overview: {
            type: String,
            required: true,
        },
        releaseDate: {
            type: String,
        },
        poster: {
            type: String,
        },
        trailer: {
            type: String,
        },
        likedUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            validate: (arr) => {
                return arr.filter(v => v === null).length === 0; 
            }
        }],
        dislikedUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            validate: (arr) => {
                return arr.filter(v => v === null).length === 0; 
            }
        }],
        comments: [
            {
                body: {
                    type: String,
                    required: true,
                },
                author: {
                    type: String,
                    required: true
                },
                createdAt: String
            }
        ],
    }
);

const Movie = model('Movie', movieSchema);

module.exports = Movie;