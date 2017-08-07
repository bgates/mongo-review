const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mustacheExpress = require('mustache-express');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

const doEverything = function (findRestrictions, howToRender) {
  MongoClient.connect('mongodb://localhost:27017/tv', function (err, db) {
    if (err) {
      console.log('winter is coming', err);
    } else {
      const collection = db.collection('game-of-thrones');
      collection
        .find(findRestrictions)
        .sort({ airdate: 1})
        .toArray(function(err, docs) {
          docs.forEach(function (doc) {
              //doc.spoilerFreeName = if (doc.season === 7) { 'spoiler'} else { doc.name }// if the episode is in the current season, show 'spoiler', otherwise, show the normal name
              doc.spoilerFreeName = (doc.season === 7 ? 'spoiler' : doc.name);
            })
        howToRender(docs);
        db.close();
      });
    }
  });
}

app.get('/', function (request, response) {
  doEverything({}, function (docs) {
    response.render('index', { episodes: docs });
  })
});

app.get('/season/7', function (request, response) {
  response.send("DUDE, I'M STILL BEHIND - NO SPOILERS")
});

app.get('/season/:seasonNumber', function (request, response) {
  const seasonNumber = parseInt(request.params.seasonNumber);
  doEverything({ season: seasonNumber }, function (docs) {
    response.render('season', { seasonNumber: seasonNumber, episodes: docs });
  })
});

app.get('/episode/:episodeId', function (request, response) {
  const id = parseInt(request.params.episodeId);
  doEverything({ id: id }, function (doc) {
    response.send('the episode goes here');
    //response.render('episode', { episode: doc });
  })
})
app.listen(3000, function () {
  console.log('listening on port 3000');
});
