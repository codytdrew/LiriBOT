//Code added to read and set any environment variables with the dotenv package
require("dotenv").config();

//This variable serves to store the imported keys.js file
var keys = require("./keys.js");

//Variable for the method that will request for tracks 
var Spotify = require("node-spotify-api");

// Creates a spotify object that can query the spotify API
var spotify = new Spotify(keys.spotify);

// Grab axios package
var axios = require("axios");

// Grab fs node package
var fs = require("fs");

//Take in the command line arguments.  Cuts node and file name off of playback
const userArguments = process.argv.slice(2);
const searchType = userArguments[0];
const searchTerm = userArguments.slice(1).join("*");

switch (searchType) {
  case "concert-this":
    concert(searchTerm);
    break;

  case "spotify-this-song":
    displaySong(searchTerm);
    break;

  case "movie-this":
    movieFinder(searchTerm);
    break;

  case "do-what-it-says":
    executeAction();
    break;
}

//======================================================================================//
//Concert Tracker
//======================================================================================//

// When we call the "concert" function
function concert() {
  axios
    .get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp")
    .then(function (response) {
      console.log(response.data[0]);
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2x
        console.log(error.response.data[0]);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

//======================================================================================//
//Song Finder
//======================================================================================//

// When we call the "songId" function, we will show the song's Artist, Name, A preview link from spotify, and Album
function displaySong(songId) {
  spotify.search({ type: 'track', query: songId }, function (err, data) {
    if (err) {
      console.log("Sorry, I can't find what you were looking for, but check this song out?")
      displaySong("The Sign by Ace of Base");
      return;
    }
    console.table({
      'Song Title': data.tracks.items[0].name,
      'Artist(s)': data.tracks.items[0].artists[0].name,
      Album: data.tracks.items[0].album.name,
      Preview: data.tracks.items[0].preview_url
    });
  });
}

//======================================================================================//
//Movie Finder
//======================================================================================//

// When we call "movieFinder" function, we will be provided a list of information pertaining to the movie
function movieFinder() {
  axios
    .get("http://www.omdbapi.com/?t=" + searchTerm + "&apikey=e8747782")
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    })
}

//======================================================================================//
//Movie Finder
//======================================================================================//

// When we call "executeAction" function, we read the random.txt file and call one of LIRI's commands
function executeAction() {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    console.log(data);

    //This makes things easier to read
    let outputArr = data.split(",");

    const searchRandom = outputArr[0];
    const searchTermRandom = outputArr[1];


    switch (searchRandom) {
      case "concert-this":
        concert(searchTermRandom);
        break;

      case "spotify-this-song":
        displaySong(searchTermRandom);
        break;

      case "movie-this":
        movieFinder(searchTermRandom);
        break;

      case "do-what-it-says":
        executeAction();
        break;

        default:
        console.log("Sorry, I didn't quite get that.");
    }

    // Loop Through the newly created output array
    for (var i = 0; i < outputArr.length; i++) {

      // Print each element (item) of the array/
      console.log(outputArr[i]);
    }
  });
}
