require("dotenv").config();

//var spotify = new Spotify(keys.spotify);


//------OMDB--------
var request = require("request");
var movie= process.argv[2];

request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

  if (!error && response.statusCode === 200) {

    console.log("==============================================");
    console.log("");
    console.log("Movie title: " + JSON.parse(body).Title);
    console.log("Release year: " + JSON.parse(body).Year);
    console.log("IMDB rating: " + JSON.parse(body).imdbRating);
    console.log(JSON.parse(body).Ratings[1]);
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
