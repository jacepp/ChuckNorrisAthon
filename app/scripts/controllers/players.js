'use strict';

angular.module('chuckNorrisAthonApp')
  .controller('PlayersCtrl', function ($scope, $http, socket, $location, $filter) {

    socket.emit('player:list');

    socket.on('game:players', function (data) {
      $scope.players = data || [];

      var check = false;
      angular.forEach($scope.players, function(value, key){
        if(value.name === $scope.$parent.playerName) {
          check = true;
        }
      });
      if(!check) {
        $location.path('/');
      }
    });

    socket.forward('player:new', $scope);
    $scope.$on('socket:player:new', function (ev, data) {
      $scope.players.push({ name: data.name, wins: data.wins, streak: data.streak, losses: data.losses });
    });

    socket.forward('player:update', $scope);
    $scope.$on('socket:player:update', function (ev, data) {
      $scope.players = data;
    });

    socket.forward('player:left', $scope);
    $scope.$on('socket:player:left', function (ev, data) {
      var i, player;
      for (i = 0; i < $scope.players.length; i++) {
        player = $scope.players[i];
        if (player.name === data.name) {
          $scope.players.splice(i, 1);
          break;
        }
      }
    });

    $scope.iAm = function() {
      var array = $scope.players || [];

      function compare(a) {
        if (a.name !== $scope.$parent.playerName) {
          return 1;
        }
        if (a.name === $scope.$parent.playerName){
          return -1;
        }
        return 0;
      }

      return $filter('filter')(array.sort(compare));
    };

  });
