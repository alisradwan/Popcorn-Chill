const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must use a valid email address'],
        },
        password: {
            type: String,
            required: true,
        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        likedMovies: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Movie',
                validate: (arr) => {
                    return arr.filter(v => v === null).length === 0;
                }
            },
        ],
        dislikedMovies: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Movie',
                validate: (arr) => {
                    return arr.filter(v => v === null).length === 0;
                }
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
    },
);

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `likedMovieCount` with the number of liked movies, and `dislikedMovieCount` with the number of disliked movies
userSchema.virtual('likedMovieCount').get(function () {
    return this.likedMovies.length;
});

userSchema.virtual('dislikedMovieCount').get(function () {
    return this.dislikedMovies.length;
});

const User = model('User', userSchema);

module.exports = User;