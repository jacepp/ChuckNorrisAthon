'use strict';

angular.module('chuckNorrisAthonApp')
  .controller('MainCtrl', function ($scope, $location, socket) {

    $scope.submit = function(playerName) {
      socket.emit('receive:name', {
        name: $scope.playerName
      }, function (result) {
        if (!result) {
          $scope.message = "That name is already taken, try again.";
        } else {
          $scope.$parent.playerName = $scope.playerName;
          $location.path('/thunder-dome');
        }
      });      
    };  
  });
