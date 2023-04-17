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

/* Steps I took to start the API:

1. From your workspace, use the command: 'npx express-generator --no-view <name-of-your-app>'

    Replace <name-of-your-app> with your planned API name (making sure to use dashes instead of spaces if needed). This will create your boilerplate routes file structure.

2. Following the instructions listed from express-generator that were printed into your terminal after install, navigate into the newly-created directory and run the command: 'npm install' to install all the dependencies. 

2a. Optional: For development purposes, I installed the 'nodemon' package with the commend: 'npm install nodemon -D'

    This installs nodemon as a developer dependency, meaning if a user were to fork and clone down my API and run npm install, it won't be added into their 'node_modules' file as it was only needed for development. 

    If you do this step, go into your package.json file and modify the 'start' command under 'scripts' to say 'nodemon' instead of 'node' - now when you do npm start, nodemon automatically refreshes your server when you make changes

3. I created a '.gitignore' file and added 'node_modules' so that it wouldn't get pushed with the rest of the files to GitHub

4. I created a git repository and went through the usual steps to initialize the directory, add, commit, and push

*/