require("dotenv").config();
var request = require("request");
var keys = require("./keys");
//var spotify = require('node-spotify-api');
//var moment = require("moment");
var movie;
var artist;

// switch statements 
var input= process.argv[2]
switch(input) {
  case "movie-this":
      getMovie();
      break;
  case "concert-this":
      getBands();
      break;
  // default:
  //     code block
}

//------OMDB--------
function getMovie () {
  movie= process.argv[3];

  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb;
  request (queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      console.log("==============================================");
      console.log("");
      console.log("Movie title: " + JSON.parse(body).Title);
      console.log("Release year: " + JSON.parse(body).Year);
      console.log("IMDB rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Movie production location: " + JSON.parse(body).Country);
      console.log("Languages: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("");
      console.log("==============================================");

    } else {
        console.log(error);
    }
  });
};

//-----Bands in Town------
function getBands () {
  artist= process.argv[3];

  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsintown;
  request (queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("==============================================");
      console.log("");
      console.log("Venue: " + JSON.parse(body)[0].venue.name);
      console.log("Location: " + JSON.parse(body)[0].venue.city + "," + JSON.parse(body)[0].venue.country);
      console.log(JSON.parse(body)[0].datetime);
      // console.log(moment((body)[0].datetime, 'YYYY-MM-DD').format('MM/DD/YYYY'));
      console.log("");
      console.log("==============================================");
    } else {
      console.log(error);
    }
  });
};

//-----Spotify---- 

// function getSongs () {
//   song= process.argv[3];
  
//   var queryUrl = "https://api.spotify.com/v1/search?q=lucky&type=track"
// }