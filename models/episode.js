
const MongoClient = require('mongodb').MongoClient;

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
