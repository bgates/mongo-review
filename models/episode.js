
//const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/tv');

const episodeSchema = new Schema({
  name: { type: String, isRequired: true },
  season: { type: Number, isRequired: true },
  number: { type: Number, isRequired: true },
  airdate: { type: Date, isRequired: true },
  summary: { type: String, isRequired: true }
});

episodeSchema.statics.findAndSort = function (findRestrictions, howToRender) {
  this
    .find(findRestrictions)
    .sort({ airdate: 1})
    .toArray(function(err, docs) {
      docs.forEach(function (doc) {
          //doc.spoilerFreeName = if (doc.season === 7) { 'spoiler'} else { doc.name }// if the episode is in the current season, show 'spoiler', otherwise, show the normal name
          doc.spoilerFreeName = (doc.season === 7 ? 'spoiler' : doc.name);
        })
    howToRender(docs);
}
const Episode = mongoose.model('Episode', episodeSchema, 'game-of-thrones');

module.exports = Episode;

/*
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

const save = function (newEpisode, redirect) {
  MongoClient.connect('mongodb://localhost:27017/tv', function (err, db) {
    if (err) {
      console.log('winter is coming', err);
    } else {
      const collection = db.collection('game-of-thrones');
      collection.save(newEpisode);
      redirect();
    }
  });
}

module.exports = {
  find: doEverything,
  save: save
}
*/
