'use strict';
/* Controllers */

function AppCtrl($scope, socket, $http, $filter) {
  socket.on('init', function(data) {
    $scope.name = data.name;
    $scope.users = data.users;
  });

  socket.on('user:join', function(data) {
    $scope.users = data.users;
  });

  socket.on('update:players', function(data) {
    $scope.users = data.players;
  });

  socket.on('new:game', function(data) {
    $scope.message = '';
  });

  socket.on('refresh:players', function(data) {
    $scope.users = data.players;
  });

  $scope.myfilter = function() {
    var array = [];

    for(var key in $scope.users) {
      array.push($scope.users[key]);
    }

    function compare(a) {
      if (a.name !== $scope.name) {
        return 1;
      }
      if (a.name === $scope.name){
        return -1;
      }
      return 0;
    }

    return $filter('filter')(array.sort(compare));
  };
}

function PhraseCtrl($scope, socket, $http) {
  socket.on('init', function(data) {
    $scope.$parent.phrase = data.phrase;
    $scope.phrase = $scope.$parent.phrase;
  });

  socket.on('get:phrase', function(data) {
    $scope.$parent.phrase = data.phrase;
    $scope.phrase = $scope.$parent.phrase;
  });

  socket.on('send:message', function(message) {
    if($scope.name != message.user) {
      if(message.input) {
        var fullPhrase = $scope.$parent.phrase;
        var redPhrase = fullPhrase.slice(0, message.text.length);
        fullPhrase = fullPhrase.substr(message.text.length);
        redPhrase = redPhrase.substr(message.input.length);
        $scope.phrase = '<span class="winning">'+ message.input +'</span><span class="losing">'+ redPhrase +'</span>'+ fullPhrase;
      }
    } else {
      if(!message.input) {
        var clipPhrase = $scope.$parent.phrase;
        var greenPhrase = clipPhrase.slice(0, message.text.length);
        clipPhrase = clipPhrase.substr(message.text.length);
        $scope.phrase = '<span class="winning">'+ greenPhrase +'</span>'+ clipPhrase;
      } else {
        var fullPhrase = $scope.$parent.phrase;
        var redPhrase = fullPhrase.slice(0, message.text.length);
        fullPhrase = fullPhrase.substr(message.text.length);
        redPhrase = redPhrase.substr(message.input.length);
        $scope.phrase = '<span class="winning">'+ message.input +'</span><span class="losing">'+ redPhrase +'</span>'+ fullPhrase;
      }
    }
  });

  socket.on('count:down', function(data) {
    if(data == 'GO!') {
      $scope.phrase = data;
    } else {
      $scope.phrase = 'The next round will start in '+ data;
    }
  });

  socket.on('new:game', function(data) {
    $scope.getPhrase();
  });

  $scope.getPhrase = function() {
    $http.get('http://api.icndb.com/jokes/random').
      success(function(data) {
        $scope.phrase = data.value.joke;
        $scope.$parent.phrase = data.value.joke;
        socket.emit('get:phrase', { phrase: data.value.joke });
      });
  };
}
PhraseCtrl.$inject = ['$scope', 'socket', '$http'];

function LeaderboardCtrl($scope, socket) {
  $scope.winner = 'N/A';
  $scope.wins = 0;
  $scope.loser = 'N/A';
  $scope.losses = 0;
  $scope.streaker = 'N/A';
  $scope.streak = 0;
  $scope.kpser = 'N/A';
  $scope.kps = 0;
  $scope.deleter = 'N/A';
  $scope.dels = 0;

  socket.on('update:players', function(data) {
    angular.forEach(data.players, function(player) {
      if(player.win > $scope.wins) {
        $scope.winner = player.name;
        $scope.wins = player.win;
      }
      if(player.loss > $scope.losses) {
        $scope.loser = player.name;
        $scope.losses = player.loss;
      }
      if(player.del > $scope.dels) {
        $scope.deleter = player.name;
        $scope.dels = player.del;
      }
      if(player.streak > $scope.streak) {
        $scope.streaker = player.name;
        $scope.streak = player.streak;
      }
      if(player.kps > $scope.kps) {
        $scope.kpser = player.name;
        $scope.kps = player.kps;
      }
    });
  });
}
LeaderboardCtrl.$inject = ['$scope', 'socket'];