const express = require('express');
const router = express.Router();
const fs = require('fs'); // imports file system (fs) module that lets us read and write files

const RECIPES_FILE = './data/recipes.json' // stores the file path to our recipes file in a variable for us to reference later

router.route('/') // since get and post are going to same route, I used .route to chain both methods off router and reduce repeated code
  .get((request, response) => {
    fs.readFile(RECIPES_FILE, 'utf8', (err, data) => {
      if (err) { // this code block from 10-14 is responsible for catching file reading errors: 
        console.error(err); // it prints an error to console 
        response.status(500).send('There was a problem reading the file.'); // sends a status code of 500 (Internal Server Error), and also sends the message listed
        return; // exits the code block
      }

      response.json(JSON.parse(data)); // takes the data, converts from .JSON to JavaScript, then responses back with .JSON output. Important to note, the readFile method returns a long string with escape characters for every single double quote/new line, so this step is required to return in the proper format
    })
  })
  .post((request, response) => {
    fs.readFile(RECIPES_FILE, 'utf8', (err, data) => {
      if (err) { // similar to above
        console.error(err); // prints an error to console 
        response.status(500).send('There was a problem reading the file.'); // sends a status code of 500 (Internal Server Error), and also sends the message listed
        return; // exits the code block
      }

      const recipesArray = JSON.parse(data) // converts .JSON data into JavaScript using the parse method, then stores that new JavaScript array in a variable for us to reference later

      const newRecipe = {
        id: (recipesArray.length + 1), // because our array is in JavaScript vs. JSON now after our conversion step, we can use JavaScript Array methods on it such as .length! This lets us create a new ID for the incoming newRecipe, assigning it a value of the current length of the array with 1 added to it.
        name: request.body.name, // lines 31-35 function the same way - we are going into the body of the post request and fetching the property listed, checking the value that was passed along with that specific property, then assigning that value here to our newRecipe object
        style: request.body.style,
        prep_time: request.body.prep_time,
        cook_time: request.body.cook_time,
        instructions: request.body.instructions
      } // by the end of this code block (lines 29-36), we have created a newRecipe object with information passed in by the user that we can then add into our recipesArray in the next step

      recipesArray.push(newRecipe); // again, since our recipesArray is in JavaScript format currently vs. JSON, we can use the push method on it to add our newRecipe object that we created into the array!

      fs.writeFile(RECIPES_FILE, JSON.stringify(recipesArray), err => {
        if (err) { // similar to above when using the readFile method of the fs (file system) module, except this error message lets the user know there was a problem WRITING to the file
          console.error(err);
          response.status(500).send('There was a problem writing to the file.');
          return;
        }

        response.json(newRecipe); // it is good practice to respond with something to the user after receiving some kind of input - here, we're showing them the JSON version of the newRecipe object we (in this case, they) created as verification that their push was successful
      })
    })
  })

router.get('/random', (request, response) => { // the ordering of this get request and the next one is important! Make sure this one comes first so that "random" isn't used as an ID. Read the comments of the next get method then come back here - works the exact same way except we generate a random integer id that gets returned.
  fs.readFile(RECIPES_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      response.status(500).send('There was a problem reading the file.');
      return;
    }

    const recipesArray = JSON.parse(data); 
    const randomNumber = Math.floor(Math.random() * recipesArray.length); // starting from right to left, we first grab the length of our recipesArray, then multiply it by a random number between 0-1, then we use the Math.floor method to round down to the next whole number

    const newRecipe = recipesArray.find(recipe => recipe.id === randomNumber); // the parseInt section was just replaced with our randomNumber variable that we created in line 61, allowing us to set our newRecipe to a random recipe in the recipesArray

    response.json(newRecipe); // returns a random recipe
  })
})

router.get('/:id', (request, response) => {
  fs.readFile(RECIPES_FILE, 'utf8', (err, data) => {
    if (err) { // similar to above, see previous readFile method!
      console.error(err);
      response.status(500).send('There was a problem reading the file.');
      return;
    }

    const recipesArray = JSON.parse(data); // this is the exact same as line 27 - we have to do it again here because the recipesArray variable in that case was defined in the scope of the post method. Since this get method is entirely separate, it doesn't know about any variables defined outside of the scope of its code block

    const newRecipe = recipesArray.find(recipe => recipe.id === parseInt(request.params.id)); // here, we're defining a new variable newRecipe. Using the find method on our recipesArray, we are looking for a recipe in the array whose id is equal (both in TYPE and in VALUE) to the id that the user enters via the URL. For example, if the user goes to /recipes/2, the request should have a parameter called id with a value of 2. The parseInt method does an aggressive type conversion on 2 and makes sure it is of type Integer (vs. possibly being interpreted by the computer as a string). 

    // If there is a recipe with the id of 2, then the newRecipe variable will be set equal to that recipe with an id of 2.
    // If there is NOT a recipe with the id of 2, then this next code block will execute because newRecipe will have a value of undefined/null making the if statement TRUE
    if (!newRecipe) {
      response.status(404).send('Recipe not found'); // sends a status code of 404 (Not Found), and also sends the message listed
      return;
    }

    response.json(newRecipe); // We respond with a JSON version of the newRecipe object that the user was looking for by id
  })
})

module.exports = router;
