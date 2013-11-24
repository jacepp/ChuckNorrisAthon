'use strict';

angular.module('chuckNorrisAthonApp')
  .controller('ThunderDomeCtrl', function ($scope, $http, socket) {

    socket.forward('game:players', $scope);
    $scope.$on('socket:game:players', function (ev, data) {
      var winStats = data;
      var streakStats = data;
      var lossStats = data;

      winStats.sort(function (a, b) {
          return a.wins - b.wins;
      });
      $scope.leadWins = winStats[winStats.length - 1];
      
      streakStats.sort(function (a, b) {
          return a.streak - b.streak;
      });
      $scope.leadStreak = streakStats[streakStats.length - 1];

      lossStats.sort(function (a, b) {
          return a.losses - b.losses;
      });
      $scope.leadLosses = lossStats[lossStats.length - 1];      
    });

  });
