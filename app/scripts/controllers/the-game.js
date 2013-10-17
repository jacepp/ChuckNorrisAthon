'use strict';

angular.module('chuckNorrisAthonApp')
  .controller('TheGameCtrl', function ($scope, $http, socket) {
    $scope.playerInput = '';
    // delete $http.defaults.headers.common['X-Requested-With'];

    // $http.get('http://api.icndb.com/jokes/random').
    //   success(function (data) {
    //     $scope.joke = data.value.joke;
    //     $scope.joke_check = data.value.joke;
    //   });
    $scope.joke = 'Check check one two one two';
    $scope.joke_check = 'Check check one two one two';

    socket.forward('game:winner', $scope);
    $scope.$on('socket:game:winner', function (ev, data) {
      $scope.joke = data +' just roundhouse kicked your face';
      $('textarea').innerHTML('');
    });


    $scope.capture = function (playerInput) {
      $scope.playerInput = playerInput;
      var checkAgainst = $scope.joke_check;
      var checkIfCorrect = checkAgainst.slice(0, playerInput.length);

      if(checkIfCorrect === playerInput) {
        if(checkIfCorrect === $scope.joke_check) {
          socket.emit('player:winner');
        }
        $scope.correct = checkIfCorrect;
        checkAgainst = checkAgainst.substr(playerInput.length);
        $scope.charsLeft = checkAgainst;
        $scope.joke = '<span class="win">'+ $scope.correct +'</span>'+ $scope.charsLeft;

        socket.emit('compare:inputs', playerInput);
      } else {
        $scope.joke = '<span class="win">'+ $scope.correct +'</span><span class="fail">'+ $scope.charsLeft +'</span>';
      }
    }

  });