export const dataCleaner = async (movieData) => {
    const movies = movieData.filter((movie) => movie.poster_path && movie.overview);
    for (let i=0; i < movies.length; i++) {
        const movie = await movies[i]
        let updatedData = {
            movie_id: movie.id,
            rating: movie.vote_average,
            vote_count: movie.vote_count,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster: 'https://image.tmdb.org/t/p/w500' + movie.poster_path
        }
        movies[i] = updatedData;
    }
    return movies;
}