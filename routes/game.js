module.exports = function(db, io) {

  const express = require('express')
  const router = express.Router()

  const path = require('path')
  const shuffle = require('knuth-shuffle').knuthShuffle
  const dbjs = require('./database')
  const database = new dbjs(db)

  const { PLAYER_JOINED, WELCOME, WITHDRAW_CARD, TRANSFER_TO_HAND, WAIT, STARTGAME, UPDATEGAMELIST, UPDATE_SERVER, UPDATE_CLIENT, CARDS_MELDED , SUCCESS, DISCARD_CARD, SUCCESSFUL_MELD, FAILED_MELD }
    = require('../constants/events')

  const MAX_PLAYERS = 2;
  const NUM_CARDS_IN_SUIT = 13;

  let playerId;
  let username;
  let session;

  /* Route for create Game */
  router.get( '/createGame', ( request, response ) => {
    console.log(request.session.player_id + ' requested new game')

    gameId = generateRandomGameId()
    database.createGame(gameId)
    .then ((result) => {
      database.createGamePlayer(gameId, request.session.player_id)
      .then (() => {
        broadcastGameList()
        response.redirect('/game/' + gameId)
      })
    })
  })

  /* Route for game room */
  router.get('/:gameId', (req, resp) => {
    gameId = req.params.gameId
    session = req.session;
    playerId = session.player_id
    username = session.user;

    //todo: remove the unnecessary arguments
    resp.render('game_rajat', { USERNAME:username, name:req.session.user, playerId: req.session.player_id, gameId: gameId})
  })

  /* Route for join Game */
  router.get('/joinGame/:gameId', (req, resp) => {

    //note: gameId is global because of no var/let/anything keyword
    //gameId = req.params.gameId
    database.createGamePlayer(req.params.gameId, req.session.player_id)
    resp.redirect('/game/' + gameId)

  })

  /* Helper Functions */

  const generateRandomGameId = () => {
    return ( Math.random() * 100000 ) | 0
  }

  const broadcastGameList = () => {
    database.getAvailableGames()
    .then ( (listGameIds) => {
      console.log(listGameIds);
      io.of('/lobby').emit( UPDATEGAMELIST, listGameIds )
    })
  }
  
  function isLegalMeld(tempMeldCards) {
    var sortedMeldCards = tempMeldCards.sort();
    var length = sortedMeldCards.length;

    //check if in range
     if(length > 1 &&
        //checks that it is not a legal same suit meld
        (sortedMeldCards[length-1]%NUM_CARDS_IN_SUIT != sortedMeldCards[0]%NUM_CARDS_IN_SUIT)) 
    {
      if(sortedMeldCards[length-1] >= sortedMeldCards[0]+NUM_CARDS_IN_SUIT) {
        console.log("Checking Legal Meld: NOT IN RANGE");
        return false;
      }
    }

    for(let i = 0; i<length-1; i++) {
      if(!isInOrder(sortedMeldCards[i], sortedMeldCards[i+1])) {
        if(!isSameRank(sortedMeldCards[i], sortedMeldCards[i+1])) {
          //bug: 1 spade, 2 heart, 
          return false;
        }
      }
    }

    console.log("Checking Legal Meld: IS LEGAL");
    return true;
  }

  function isInOrder(card1, card2) {
    if((card1 == card2+1) || (card1 == card2-1)) {
      return true;
    }

    return false;
  }

  function isSameRank(card1, card2) {
    if((card1 % 13) == (card2 % 13)) {
      return true;
    }
    
    return false;
  }

  /* Socket Operations */
  const game_io = io.of('/game')
  game_io.on('connection', function(socket) {
    console.log(username + " connected to /game namespace");

    //Used to pass playerId to client
    socket.emit(WELCOME, {playerId: playerId})

    /* Game Functions */
    const playerJoined = (data) => {
      socket.join(data.gameId.toString())
      game_io.to(data.gameId.toString()).emit("user_entered_chat", "User " + username + " has entered the room...");

      let playerCount = io.nsps['/game'].adapter.rooms[gameId.toString()].length

      if(playerCount == MAX_PLAYERS) {
        initialiseCardsJSON(gameId)
        .then ((gameJSON) => {
          game_io.to(data.gameId.toString()).emit( STARTGAME, gameJSON )
        })
        database.updateAvailableGames(gameId)
        .then (() => {
          broadcastGameList()
        })
      }
      else {
        game_io.to(data.gameId.toString()).emit( WAIT, {msg : 'Please wait'} )
      }
    }

    const initialiseCardsJSON = (gameId) => {

      return database.getGamePlayer(gameId)
      .then((players) => {

        console.log("Players: " + players[0] + " " + players[1]);

        cards = [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,
          24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,
          47,48,49,50,51,52]

        cardsShuffled = shuffle(cards.slice(0))
        deckArray = cardsShuffled.slice(0,31)
        dicardPileArray = cardsShuffled.slice(31,32)
        player1HandArray = cardsShuffled.slice(32,42)
        player2HandArray = cardsShuffled.slice(42,52)

        json = {
          gameId : gameId,
          meldId : 0,
          deck : deckArray,
          discard_pile : dicardPileArray,
          playerHands : {
            [players[0].player_id]  : player1HandArray,
            [players[1].player_id]  : player2HandArray
          },
          turn : players[0].player_id,

          melds : {}
        }

        database.addGameStateToDb(json)

        return json
      });
    }

    const updateGame = (json) => {
      database.addGameStateToDb(json);
      game_io.to(json.gameId.toString()).emit( UPDATE_SERVER, json )
    }

    const withdrawCard = (json) => {
      updateGame(json);
      game_io.to(json.gameId.toString()).emit(SUCCESS, json)

    }

    const switchPlayers = (json) => {
      let players = Object.keys(json.playerHands)

      if(players[0].localeCompare(json.turn)==0){
        json.turn = players[1]
      }
      else {
        json.turn = players[0]
      }
      return json
    }

    const cardDiscarded = (json) => {

      let updatedJson = switchPlayers(json)

      console.log('server got discard request');
      console.log(updatedJson);
      updateGame(updatedJson)
    }
    
    const cardsMelded = (gameJSON, meldJSON) => {
      if(isLegalMeld(meldJSON.melds[meldJSON.meldId])) {
        console.log("IS LEGAL MELD");
        //update to db
        //increment meldId
        meldJSON.meldId++;
        game_io.to(meldJSON.gameId.toString()).emit(SUCCESSFUL_MELD, meldJSON);
      }
      else {
        //why does gameJSON have the melded cards? shouldn't onlymeldJSON have it?
        console.log("IS NOT LEGAL MELD");
        gameJSON.melds[gameJSON.meldId].length = 0; //clear last meld
        console.log(gameJSON.melds[gameJSON.meldId].toString());
        game_io.to(gameJSON.gameId.toString()).emit(FAILED_MELD, gameJSON);
      }
    }
    /* End Game Functions */

    /*New player joined /game */
    socket.on(PLAYER_JOINED, playerJoined)
    socket.on(UPDATE_CLIENT, updateGame)
    socket.on(DISCARD_CARD, cardDiscarded)
    socket.on(WITHDRAW_CARD, withdrawCard)
    socket.on(CARDS_MELDED, cardsMelded)

    socket.on('disconnect', () => {
      console.log("user disconnected from /game namespace");

      if(typeof gameId != 'undefined') {
        game_io.to(gameId).emit("user_left_chat", "User " + session.user + " has left the room...");

        database.updateAvailableGames(gameId)
        .then (() => {
          broadcastGameList()
        })
      }
    });

    socket.on('chat_sent', function(message) {
      user = message.substr(0, message.indexOf(' '));
      msg = message.substr(message.indexOf(' ')+1);

      console.log("CHAT:" + message)
      if(typeof gameId != 'undefined') {
        game_io.to(gameId).emit('chat_received', user + ": " + msg);
      }
    });
});


return router
}
