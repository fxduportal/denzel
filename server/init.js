/* eslint-disable no-console, no-process-exit */
const imdb = require('./imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const METASCORE = 70;

module.exports.start = async (actor = DENZEL_IMDB_ID, metascore = METASCORE) => {
    try {
        console.log(`📽️  fetching filmography of ${actor}...`);
        const movies = await imdb(actor);
        const awesome = movies.filter(movie => movie.metascore >= metascore);

        movies.forEach(movie => {
            let title = movie.title.replace(/\(([0-9]{4})\)/, '');

            movie.title = title.trim();
            console.log(movie)
        });

        awesome.forEach(movie => {
            let title = movie.title.replace(/\(([0-9]{4})\)/, '');

            movie.title = title.trim();
        });

        console.log(`🍿 ${movies.length} movies found`);
        console.log(`🥇 ${awesome.length} awesome movies found`);
        return { movies, awesome };
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

const [, , id, metascore] = process.argv;
