var currentJoke = '';

var playerList = (function () {
  var players = {};

  var claim = function (name) {
    if (!name || players[name]) {
      return false;
    } else {
      players[name] = true;
      return true;
    }
  };

  var get = function () {
    var res = [];
    for (player in players) {
      res.push(player);
    }
    return res;
  };

  var free = function (name) {
    if (players[name]) {
      delete players[name];
    }
  };

  return { claim: claim, free: free, get: get };
}());

module.exports = function (socket) {
  var io = require('../app.js').io
    , http = require('http');

  socket.on('receive:name', function (data, fn) {
    if (playerList.claim(data.name)) {
      socket.name = data.name;
      socket.wins = 0;
      socket.streak = 0;
      socket.losses = 0;
      
      io.sockets.emit('player:new', {
        name: socket.name,
        wins: socket.wins,
        streak: socket.streak,
        losses: socket.losses
      });

      fn(true);
    } else {
      fn(false);
    }
  });

  socket.on('player:list', function () {
    var players = playersFromSockets();
    socket.emit('game:players', players);
  });





  // notify other clients that a new user has joined
  // socket.broadcast.emit('user:join', {
  //   name: name
  // });

  // broadcast a user's message to other users
  // socket.on('send:message', function (data) {
  //   socket.broadcast.emit('send:message', {
  //     user: name,
  //     text: data.message
  //   });
  // });

  

  // clean up when a player leaves, and broadcast it to other players
  socket.on('disconnect', function () {
    io.sockets.emit('player:left', {
      name: socket.name
    });
    playerList.free(socket.name);
  });

  function playersFromSockets() {
    var players = [];
    io.sockets.clients().forEach(function (socket) {
      if(socket.name) {
        players.push({ name: socket.name, wins: socket.wins, streak: socket.streak, losses: socket.losses });
      }
    });
    return players;
  }
};
