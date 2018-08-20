require("dotenv").config();
var request = require("request");
var keys = require("./keys");
const chalk = require('chalk');
var Spotify = require('node-spotify-api');
//var moment = require("moment");
var movie;
var artist;
var song;

// switch statements 
var input= process.argv[2]
switch(input) {
  case "movie-this": // node liri.js movie-this <movie name>
      getMovie();
      break;
  case "concert-this": // node liri.js concert-this <artist name> 
      getBands();
      break;
  case "spotify-this-song": // node liri.js spotify-this-song <song name> 
      getSong();
      break;
  // default:
  // code block
}

//------OMDB--------
function getMovie () {
  if(!process.argv[3]){
    movie= "mr+nobody";
    console.log(chalk.redBright("No movie selected, default movie loaded"));
  } else {
    movie= process.argv[3];
  }
  
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb;
  request (queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      console.log("==============================================");
      console.log("\n" + chalk.redBright.underline("Title") + ": " + JSON.parse(body).Title + "\n");
      console.log(chalk.redBright("Release year: ") + JSON.parse(body).Year);
      console.log(chalk.redBright("IMDB Rating: ") + JSON.parse(body).imdbRating);
      console.log(chalk.redBright("Rotten Tomatoes Rating: ") + JSON.parse(body).Ratings[1].Value);
      console.log(chalk.redBright("Production Location: ") + JSON.parse(body).Country);
      console.log(chalk.redBright("Languages: ") + JSON.parse(body).Language);
      console.log(chalk.redBright("Actors: ") + JSON.parse(body).Actors);
      console.log("\n" + chalk.redBright("Plot: ") + JSON.parse(body).Plot + "\n");
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
      console.log("\n" + chalk.blueBright.underline("Artist") + ": " + artist + "\n");
      console.log(chalk.blueBright("Venue") + ": " + JSON.parse(body)[0].venue.name);
      console.log(chalk.blueBright("Location") + ": " + JSON.parse(body)[0].venue.city + "," + JSON.parse(body)[0].venue.country);
      console.log("\n" + chalk.blueBright("Time") + ": " + JSON.parse(body)[0].datetime + "\n");
      // console.log(moment((body)[0].datetime).format('MM/DD/YYYY'));
      console.log("==============================================");
    } else {
      console.log(error);
    }
  });
};

//-----Spotify---- 
function getSong() {
  song= process.argv[3];

  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
      console.log("==============================================");
      console.log("\n" + chalk.greenBright.underline("Artist") + ": " + data.tracks.items[0].album.name + "\n");
      console.log(chalk.greenBright("Song") + ": " + data.tracks.items[0].name);
      console.log(chalk.greenBright("Album") + ": " + data.tracks.items[0].album.name);
      console.log(chalk.greenBright("Preview") + ": " + data.tracks.items[0].external_urls.spotify + "\n");
      console.log("==============================================");
    }
  });
}