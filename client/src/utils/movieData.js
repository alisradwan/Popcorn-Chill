import { getVideos } from '../utils/API';
import moment from 'moment';

export const cleanMovieData = async (movieData) => {
    const movies = movieData.filter((movie) => movie.poster_path && movie.overview);
    
    for (let i=0; i < movies.length; i++) {
        const movie = await movies[i]

        let cleanedData = {
            externalMovieId: movie.id,
            rating: movie.vote_average,
            voteCount: movie.vote_count,
            title: movie.title,
            overview: movie.overview,
            releaseDate: moment(movie.release).format('LL'),
            poster: 'https://image.tmdb.org/t/p/w500' + movie.poster_path
        }

        try {
            const videoResponse = await getVideos(movie.id);
            if (videoResponse.ok) {
                const {results: videoResults} = await videoResponse.json();

                for (let j=0; j < videoResults.length; j++) {
                    if (videoResults[j].type === 'Trailer') {
                        const trailerKey = videoResults[j].key;
                        cleanedData.trailer = `https://www.youtube.com/embed/${trailerKey}`;
                        break
                    }
                }
            }
        } catch(err) {
            console.log(err);
        }
        movies[i] = cleanedData;
    }

    return movies;
}