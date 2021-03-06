const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const Episode = require('./models/episode');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.get('/', function (request, response) {
  Episode.find({}, function (docs) {
    response.render('index', { episodes: docs });
  })
});

app.get('/season/7', function (request, response) {
  response.send("DUDE, I'M STILL BEHIND - NO SPOILERS")
});

app.get('/season/:seasonNumber', function (request, response) {
  const seasonNumber = parseInt(request.params.seasonNumber);
  Episode.find({ season: seasonNumber }, function (docs) {
    response.render('season', { seasonNumber: seasonNumber, episodes: docs });
  })
});

app.get('/episode/:episodeId', function (request, response) {
  const id = parseInt(request.params.episodeId);
  Episode.find({ id: id }, function (doc) {
    response.send('the episode goes here');
    //response.render('episode', { episode: doc });
  })
});

app.get('/new-episode', function (request, response) {
  response.render('new-episode-form');
});

app.post('/create-episode', function (request, response) {
  let newEpisode = {
    name: request.body['episode-name'],
    season: request.body['season-number'],
    number: request.body['episode-number'],
    airdate: request.body.airdate,
    summary: request.body.summary
  }
  const schema = {
    name: {
      notEmpty: true
    },
    season: {
      notEmpty: true
    },
    number: {
      notEmpty: true
    },
    airdate: {
      notEmpty: true
    },
    summary: {
      notEmpty: true
    }
  }
  request.validate(schema);
  request.getValidationResult().then(function(result) {
    if (result.isEmpty()) { //everything worked
      Episode.save(newEpisode, function () {
        response.redirect('/');
      });
    } else {
      response.render('new-episode-form', { error: true, episode: newEpisode })
    }
  });
});


app.listen(3000, function () {
  console.log('listening on port 3000');
});
