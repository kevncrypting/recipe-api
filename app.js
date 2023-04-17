const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const recipesRouter = require('./routes/recipes'); // sets up the route for recipes endpoint

const cors = require('cors'); // imports the cors module
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors()); // sets up cors middleware to run inbetween the user's request and the server, allowing for cross origin resource sharing

app.use('/', indexRouter);
app.use('/recipes', recipesRouter); // middleware that redirects users to use the recipesRouter route when they go to /recipes

module.exports = app;
