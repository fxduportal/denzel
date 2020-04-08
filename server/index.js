/* eslint-disable no-undef */
/* eslint-disable indent */
/* eslint-disable func-names */
/* eslint-disable quote-props */
/* eslint-disable no-process-env */
'use strict'
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { PORT } = require('./constants');
// const {
//     graphql,
//     GraphQLSchema,
//     GraphQLObjectType,
//     GraphQLString,
// } = require('graphql');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
const baseUrl = 'http://localhost:9292';


//#region Server/Requests configuration
const CONNECTION_URL = process.env.CONNECTION_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type', 'Authorization'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}));
app.use(helmet());

let collectionAwesome, collectionMovie, database;

/**
 * Initialisation of the connection of the app to mongo
 */
// MongoClient.connect(CONNECTION_URL, {
//     useNewUrlParser: true, useUnifiedTopology: true
// }, (error, client) => {
//     if (error) {
//         throw error;
//     }
//     database = client.db(DATABASE_NAME);
//     collectionMovie = database.collection('movie');
//     collectionAwesome = database.collection('awesome');
//     console.log('Connected to ' + DATABASE_NAME + ' !');
// });


//#region Serverless api
const serverless = require('serverless-http');
const router = express.Router();

module.exports.handler = serverless(app);
app.use('/.netlify/functions/index', router);

//#endregion

router.options('*', cors());

/**
 * Gets us all the movies, with a get request and an collection.find
 */
router.get('/movies', async (request, response) => {
    let data = {};
    const client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
        .catch((err) => {
            console.log(err);
        });
    if (!client) {
        return;
    }
    try {
        const db = client.db(DATABASE_NAME);
        const collectionMovie = db.collection('movie');
        data = await collectionMovie.findOne({}).toArray();
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
    if (data && data.data) {
        return data.data;
    }
    return 'empty';
});

/**
 * Gets us a movie by its id
 */
router.get('/moviesId/:id', async (request, response) => {
    let data = {};
    const client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
        .catch((err) => {
            console.log(err);
        });
    if (!client) {
        return;
    }
    try {
        const db = client.db(DATABASE_NAME);
        const collectionMovie = db.collection('movie');
        data = await collectionMovie.findOne({ 'movie.id': request.params.id }).toArray();
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
    if (data && data.data) {
        return data.data;
    }
    return 'empty';
});

/**
 * Gets us a movie by its title
 */
router.get('/moviesTitle/:title', async (request, response) => {
      let data = {};
    const client = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
        .catch((err) => {
            console.log(err);
        });
    if (!client) {
        return;
    }
    try {
        const db = client.db(DATABASE_NAME);
        const collectionMovie = db.collection('movie');
        data = await collectionMovie.findOne({ 'title': request.params.id }).toArray();
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
    if (data && data.data) {
        return data.data;
    }
    return 'empty';
});

/**
 * Inserts the asked movie inside the collection movie of the db
 */
router.post('/movie', (request, response) => {
    collectionMovie.insertOne(request.body, (error, result) => {
        if (error) {
            error.reject();
        }
        response.send(result);
    });
});

/**
 * Inserts the asked movie inside the collection awesome of the db
 */
router.post('/movie/aw', (request, response) => {
    collectionAwesome.insertOne(request.body, (error, result) => {
        if (error) {
            error.reject();
        }
        response.send(result);
    });
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
//#endregion

//#region intiDB
const init = require('./init');
const axios = require('axios');

/**
 * Function that clean our database, gets all the data from imdb and fill up the database from the collected data
 */
let initDb = async () => {
    let { movies, awesome } = await init.start();
    let counterAwesome = 0, counterMovies = 0;

    collectionMovie.deleteMany({}).then(async () => {
        console.log('🗑 Previous movies database cleaned');
        movies.forEach(movie => {
            try {
                axios.post(baseUrl + '/movie', { movie });
                counterMovies += 1;
            } catch (error) {
                console.error(error);
            }
        });
        console.log(`🎬 ${counterMovies} movies added to the database`);
    }, (error) => {
        console.error(error);
    });

    collectionAwesome.deleteMany({}).then(async () => {
        console.log('🗑 Previous awesome database cleaned');
        awesome.forEach(movie => {
            try {
                axios.post(`${baseUrl}/movie/aw`, { movie });
                counterAwesome += 1;
            } catch (error) {
                console.error(error);
            }
        });
        console.log(`🌟 ${counterAwesome} awesome movies registered in the database`);
    });
};

//initDb();
//#endregion
