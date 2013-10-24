'use strict';

angular.module('chuckNorrisAthonApp')
  .controller('ThunderDomeCtrl', function ($scope, $http, socket) {
    
    socket.forward('game:players', $scope);
    $scope.$on('socket:game:players', function (ev, data) {
      $scope.wins = data.reduce(function(max, x) {
          return x.wins > max.wins ? x : max;
      });

      console.log($scope.wins)
    });
    // $scope.wins = { name: "N/A", total: 0 }
    // $scope.streak = { name: "N/A", total: 0 }
    // $scope.losses = { name: "N/A", total: 0 }

  });
