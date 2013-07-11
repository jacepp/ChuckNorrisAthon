var Moniker = require('moniker');
var phrase = null;
var measure = '';
var lastWinner;

// Keep track of which names are used so that there are no duplicates
var players = (function() {
  var playerList = {};
  var i = 0;

  var claim = function(player) {
    if (!player.name) {
      return false;
    } else {
      playerList[player.name] = player;
      return true;
    }
  };

  var newPlayer = function() {
    var newName = Moniker.generator([Moniker.adjective, Moniker.noun]);
    var player = {
      name  : '',
      win   : 0,
      loss  : 0,
      kps   : 0,
      del   : 0,
      streak: 0
    };

    do {
      player.name = newName.choose();
    } while (!claim(player));

    return player;
  };

  var get = function() {
    var res = playerList;
    return res;
  };

  var free = function(player) {
    delete playerList[player];
  };

  var refresh = function(refreshList) {
    playerList = refreshList;
  };

  return {
    claim: claim,
    free: free,
    get: get,
    refresh: refresh,
    newPlayer: newPlayer
  };
}());

// export function for listening to the socket
module.exports = function(socket) {
  var io = require('../app.js').io;
  var player = players.newPlayer();

  socket.name = player.name;
  socket.start = 0;
  socket.end = 0;
  socket.keypress = 0;

  socket.emit('init', {
    name: player.name,
    users: players.get(),
    phrase: phrase
  });

  socket.broadcast.emit('user:join', {
    name: player.name,
    users: players.get()
  });

  socket.on('send:message', function(data) {
    var users = players.get();
    socket.keypress++;

    if(data.keypress == 8 || data.keypress == 46) {
      users[data.name].del++;
    }

    if(measure.length == 0 || measure.length <= data.message.length) {
      var phraseCheck = phrase;
      if(data.message.length > 0 && phraseCheck != null) {
        phraseCheck = phraseCheck.slice(0, data.message.length);
      }

      if(data.message == phraseCheck) {
        measure = data.message;
        io.sockets.emit('send:message', {
          user: data.name,
          text: measure
        });
      }
    } else if(measure.length > data.message.length) {
      var phraseCheck = phrase;
      if(data.message.length > 0 && phraseCheck != null) {
        phraseCheck = phraseCheck.slice(0, data.message.length);
      }

      if(data.message == phraseCheck) {
        socket.emit('send:message', {
          user: data.name,
          text: measure,
          input: data.message
        });
      }
    }
  });

  socket.on('get:phrase', function(data) {
    phrase = data.phrase;
    socket.broadcast.emit('get:phrase', { phrase: phrase });
    socket.start = new Date().getTime() / 1000;
  });

  socket.on('winner:winner', function(data) {
    phrase = null;
    var users = players.get();
    socket.end = new Date().getTime() / 1000;
    var seconds = socket.end - socket.start;
    var keys = socket.keypress / seconds;

    for(player in users) {
      if(player == data.player) {
        lastWinner = player;
        if(data.player == lastWinner) {
          users[player].streak++;
        }
        users[player].win++;
        users[player].kps = parseFloat(keys.toFixed(1));
      } else {
        users[player].loss++;
      }

      io.sockets.clients().forEach(function(socket) {
        if(socket.name == player) {
          socket.end = new Date().getTime() / 1000;
          var seconds = socket.end - socket.start;
          var keys = socket.keypress / seconds;
          users[player].kps = parseFloat(keys.toFixed(1));
        }
      });
    }

    players.refresh(users);
    io.sockets.emit('update:players', { players: users });
    measure = '';
    setTimeout(countDown, 0);
  });

  var counter = 3;

  function countDown() {
    if(counter > 0) {
      io.sockets.emit('count:down', counter);
      setTimeout(countDown, 1000);
      counter--;
    } else {
      io.sockets.emit('count:down', 'GO!');
      socket.emit('new:game');
      counter = 3;
    }
  };

  socket.on('disconnect', function() {
    players.free(this.name);
    socket.broadcast.emit('refresh:players', { players: players.get() });
  });
};
