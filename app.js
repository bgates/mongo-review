const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mustacheExpress = require('mustache-express');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');


app.get('/', function (request, response) {
  MongoClient.connect('mongodb://localhost:27017/tv', function (err, db) {
    if (err) {
      console.log('winter is coming', err);
    } else {
      const collection = db.collection('game-of-thrones');
      collection
        .find({})
        .sort({ airdate: 1})
        .toArray(function(err, docs) {
          docs.forEach(function (doc) {
              //doc.spoilerFreeName = if (doc.season === 7) { 'spoiler'} else { doc.name }// if the episode is in the current season, show 'spoiler', otherwise, show the normal name
              doc.spoilerFreeName = (doc.season === 7 ? 'spoiler' : doc.name);
            })
        response.render('index', { episodes: docs });
        db.close();
      });
    }
  });
});

app.get('/season/:seasonNumber', function (request, response) {
  const seasonNumber = parseInt(request.params.seasonNumber);
  MongoClient.connect('mongodb://localhost:27017/tv', function (err, db) {
    if (err) {
      console.log('winter is coming', err);
    } else {
      const collection = db.collection('game-of-thrones');
      collection
        .find({ season: seasonNumber })
        .sort({ airdate: 1})
        .toArray(function(err, docs) {
          docs.forEach(function (doc) {
            //doc.spoilerFreeName = if (doc.season === 7) { 'spoiler'} else { doc.name }// if the episode is in the current season, show 'spoiler', otherwise, show the normal name
            doc.spoilerFreeName = (doc.season === 7 ? 'spoiler' : doc.name);
          })
          response.render('season', { seasonNumber: seasonNumber, episodes: docs });
          db.close();
        });
    }
  });
  //response.send('page for season #' + request.params.seasonNumber);
});

app.listen(3000, function () {
  console.log('listening on port 3000');
});
