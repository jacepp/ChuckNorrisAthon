'use strict';

angular.module('chuckNorrisAthonApp')
  .controller('ThunderDomeCtrl', function ($scope, $http) {
    
    $scope.wins = { name: "N/A", total: 0 }
    $scope.streak = { name: "N/A", total: 0 }
    $scope.losses = { name: "N/A", total: 0 }

  });
