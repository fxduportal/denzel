/* eslint-disable indent */
/* eslint-disable func-names */
/* eslint-disable quote-props */
/* eslint-disable no-process-env */
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
const ObjectId = require('mongodb').ObjectID;

//#region Server/Requests configuration
const CONNECTION_URL = process.env.CONNECTION_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

let collection, database;

MongoClient.connect(CONNECTION_URL, {
    useNewUrlParser: true
}, (error, client) => {
    if (error) {
        throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection('movie');
    console.log('Connected to ' + DATABASE_NAME + ' !');
});

app.options('*', cors());
app.get('/', (request, response) => {
    response.send('Hello You');
});

app.get('/movies', (request, response) => {
    collection.find({}).toArray((error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get('/movies/:id', (request, response) => {
    collection.findOne({ 'movie.id': request.params.id }, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get('/moviesInit/:id', (request, response) => {
    collection.findOne({ 'movie.id': request.params.id }, (error, result) => {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.post('/movie', (request, response) => {
    collection.insert(request.body, (error, result) => {
        if (error) {
            return response.status(500).send(error);
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

let initDb = async () => {
    let { movies, awesome } = await init.start();

    collection.deleteMany({});
    movies.forEach(movie => {
        axios.post(baseUrl + '/movie', { movie }).then(
            function (resp) {
                console.log('Get response ' + resp + ' for movie ' + movie.id);
            }).catch(function (error) {
                console.log('Get error ' + error + ' for movie ' + movie.id);
            });
    });
};

initDb();
//#endregion
