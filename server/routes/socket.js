var leadPlayer = '';
var playerStreak = null;
var jokePersist = null;

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
  var io = require('../server.js').io
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

  socket.on('game:init', function () {
    (function loop() {
      if (io.sockets.clients().filter(filterNullValues).length < 2) {
        console.log(io.sockets.clients().filter(filterNullValues).length)
        setTimeout(function () { loop() }, 1000);
      } else {
        if(!jokePersist) {
          getJoke();
        } else {
          socket.emit('game:newcomer', jokePersist);
        }
        return;
      }
    }());
  });

  socket.on('player:winner', function () {
    var winner = socket.name

    io.sockets.clients().forEach(function (socket) {
      if(winner === socket.name) {
        socket.wins += 1;
        if(winner === playerStreak || playerStreak === null) {
          socket.streak += 1;
          playerStreak = winner;
        }
      } else {
        socket.losses += 1;
      }
    });

    var players = playersFromSockets();
    io.sockets.emit('game:players', players);
    io.sockets.emit('game:winner', winner);
  });

  socket.on('game:reset', function () {
    leadPlayer = '';
    getJoke();
  });

  socket.on('compare:inputs', function (data) {
    if(data.length > leadPlayer.length) {
      io.sockets.emit('player:lead', { player: socket.name, lead: data });
      leadPlayer = data;
    }
  });

  socket.on('disconnect', function () {
    io.sockets.emit('player:left', {
      name: socket.name
    });
    playerList.free(socket.name);
  });



  function filterNullValues(i) {
    return (i != null);
  }

  function getJoke() {
    var options = {
      host: 'api.icndb.com',
      path: '/jokes/random',
    };

    http.get(options).on('response', function (response) {
      var body = '';
      response.on('data', function (chunk) {
        body += chunk;
        return;
      });
      response.on('end', function () {
        jokePersist = body;
        io.sockets.emit('game:new', body);
        return;
      });
    });
    return;
  }

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
