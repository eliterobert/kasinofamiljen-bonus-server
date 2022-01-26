var express = require('express');
var router = express.Router();


router.get('/add/:namn/:spel/:insats', function(req, res, next) {
  console.log(req.params.insats);
  addGameToBonusHunt(req.params.namn,req.params.spel,parseFloat(req.params.insats));
  res.send('game added ' + req.params.namn);
});

router.get('/delete/:spel', function(req, res, next) {
  console.log(req.params.namn);
  getListAndDeleteGame(req.params.spel);
  res.send('game deleted ' + req.params.spel);
});

var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keymHzzUdhNbLL8Nk'}).base('applqh1pzt2Df9pvp');


const getListOfGamess = () => {
var listOfGames = [];
var trackrecord = new Map();
base('BonusHunt').select({
    maxRecords: 50,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
        console.log("Spel: "+ record.get('Game'), "Insats: " + record.get('Insats'));
        console.log(record)
        listOfGames.push(record);
    });
    return listOfGames;
}, function done(err) {
    if (err) { console.error(err); return; }
});
}

const addGameToBonusHunt = (namn, spel, insats) => {
  base('BonusHunt').create([
    {
      "fields": {
        "namn": namn,
        "spel": spel,
        "insats": insats
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
    });
  });
}

function getListAndDeleteGame(spelId){
  base('BonusHunt').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 3,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
        var gameId = record.get('spel');
        if(gameId.includes(spelId)) {
          console.log("Table ID: " + record.id);
          base('BonusHunt').destroy(record.id, function(err, deletedRecords) {
          if (err) {
            console.error(err);
            return;
          }
        });
        }
    });
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); return; }
});
}



const updateGameBonusHunt = (namn, spel, insats) => {
  base('BonusHunt').update([
    {
      "id": "reclG2BEaAey4giY0",
      "fields": {
        "name": "Robert Hunt",
        "spel": "Reactoonz",
        "insats": 0.4,
        "vinst": 40
      }
    },
    {
      "id": "recnDZ3BKKFRcQk7o",
      "fields": {
        "name": "Robert Hunt",
        "spel": "Book of dead",
        "insats": 0.6,
        "vinst": 30
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function(record) {
      console.log(record.get('name'));
    });
  });
}

exports.addGameToBonusHunt = addGameToBonusHunt
exports.getListOfGames = getListOfGamess;
module.exports = router;
