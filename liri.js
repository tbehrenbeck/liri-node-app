require("dotenv").config();
var request = require("request");
var keys = require("./keys");
const chalk = require('chalk');
var Spotify = require('node-spotify-api');
var moment = require("moment");
var fs = require("fs");
var movie;
var artist;
var song;
var input = process.argv[3];
for (var i=4; i < process.argv.length; i++) {
  input += (" " + process.argv[i]);
};

// switch statements 
var command= process.argv[2]
switch(command) {
  case "movie-this": // node liri.js movie-this <movie name>
      getMovie();
      break;
  case "concert-this": // node liri.js concert-this <artist name> 
      getBands();
      break;
  case "spotify-this-song": // node liri.js spotify-this-song <song name> 
      if (!input) {
        getDefaultSong();
      } else {
        getSong();
      }
      break;
  case "do-what-it-says":
      getRead();
      break;
}

//------OMDB--------
function getMovie () {
  if(!input){
    movie= "mr+nobody";
    console.log(chalk.bgRed.white("No movie selected, default movie loaded"));
  } else {
    movie= input.replace(/ /g, '+');
  }
  
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb;
  request (queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
       
      if (JSON.parse(body).Response === "True") {
        console.log()
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
        console.log("\n" + chalk.bgRed.white("Looks like I don't have anything on that, try searching for somethign else." + "\n"));
      }

    } else {
        console.log(error);
    }
  });
};

//-----Bands in Town------
function getBands () {
  if (!input) {
    console.log("\n" + chalk.bgRed.white("ERROR: You did not provide an artist\n"));
    return;
  } else {
    var artist = input.trim();
  };

  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsintown;
  request (queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      console.log("==============================================");
      console.log("\n" + chalk.blueBright.underline("Artist") + ": " + artist + "\n");
      console.log(chalk.blueBright("Venue") + ": " + JSON.parse(body)[0].venue.name);
      console.log(chalk.blueBright("Location") + ": " + JSON.parse(body)[0].venue.city + "," + JSON.parse(body)[0].venue.country);
      console.log(chalk.blueBright("Time") + ": " + moment(JSON.parse(body)[0].datetime.slice(0, 10), 'YYYY-MM-DD').format('MM/DD/YYYY')  + "\n")
      console.log("==============================================");

    } else {
      console.log(error);
    }
  });
};

//-----Spotify---- 
function getSong() {
  song= input.trim();

  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      return console.log(chalk.bgRed.white("\nSong not found, try searching for another song\n"));
    } else {
        console.log("==============================================");
        console.log("\n" + chalk.greenBright("Artist") + ": " + data.tracks.items[0].artists[0].name);
        console.log(chalk.greenBright("Album") + ": " + data.tracks.items[0].album.name);
        console.log(chalk.greenBright("Song") + ": " + data.tracks.items[0].name);
        console.log(chalk.greenBright("Preview") + ": " + data.tracks.items[0].external_urls.spotify + "\n");
        console.log("==============================================");
    }
  });
}

function getDefaultSong() {
  song= "the sign";

  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
        console.log(chalk.bgRed.white("No song selected, default song loaded"));
        console.log("==============================================");
        console.log("\n" + chalk.greenBright("Artist") + ": " + data.tracks.items[5].artists[0].name);
        console.log(chalk.greenBright("Album") + ": " + data.tracks.items[5].album.name);
        console.log(chalk.greenBright("Song") + ": " + data.tracks.items[5].name);
        console.log(chalk.greenBright("Preview") + ": " + data.tracks.items[5].external_urls.spotify + "\n");
        console.log("==============================================");
    }
  });
}

//-----Do-What-It-Says----
function getRead() {

  fs.readFile("random.txt", "utf8", function(error, data) {
    if(error) {
      console.log(error);
    }
    var readArr= data.split(",");
    console.log(readArr);
    
    command = readArr[0];
    input = readArr[1];
    
    switch(command) {
      case "movie-this": // node liri.js movie-this <movie name>
          getMovie();
          break;
      case "concert-this": // node liri.js concert-this <artist name> 
          getBands();
          break;
      case "spotify-this-song": // node liri.js spotify-this-song <song name> 
          if (!input) {
            getDefaultSong();
          } else {
            getSong();
          }
          break;
        }
  });
}