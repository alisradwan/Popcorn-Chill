const { Schema, model } = require('mongoose');

const movieSchema = new Schema(
    {
        movie_id: {
            type: Number,
            required: true,
            unique: true
        },
        poster: {
            type: String
        },
        adult: {
            type: Boolean
        },
        overview: {
            type: String,
            required: true
        },
        release_date: {
            type: String
        },
        genres: [
            {
                type: String
            },
        ],
        title: {
            type: String,
            required: true
        },
        popularity: {
            type: Number
        },
        vote_count: {
            type: Number
        },
        runtime: {
            type: Number
        },
        trailer: {
            type: String
        },
        homepage: {
            type: String
        },
        liked: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            validate: (arr) => {
                return arr.filter( v => v === null).length === 0;
            }
        }],
        disliked: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            validate: (arr) => {
                return arr.filter( v => v === null).length === 0;
            }
        }],
    }
);

const Movie = model('Movie', movieSchema);

module.exports = Movie;