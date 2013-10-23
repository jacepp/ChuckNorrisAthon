'use strict';

angular.module('chuckNorrisAthonApp')
  .controller('TheGameCtrl', function ($scope, $http, socket) {
    $scope.playerInput = '';
    $scope.sansLeader = '';
    
    socket.emit('game:init');

    socket.forward('game:new', $scope);
    $scope.$on('socket:game:new', function (ev, data) {
      data = JSON.parse(data);
      $scope.joke = data.value.joke;
      $scope.sansLeader = $scope.joke;
      $scope.jokeCheck = data.value.joke;
    });

    socket.forward('game:newcomer', $scope);
    $scope.$on('socket:game:newcomer', function (ev, data) {
      data = JSON.parse(data);
      $scope.joke = data.value.joke;
      $scope.sansLeader = $scope.joke;
      $scope.jokeCheck = data.value.joke;
    });

    socket.forward('game:winner', $scope);
    $scope.$on('socket:game:winner', function (ev, data) {
      $scope.joke = data +' just roundhouse kicked your face';
      if(data == $scope.$parent.playerName) {
        socket.emit('game:reset');
      }
    });

    socket.forward('player:lead', $scope);
    $scope.$on('socket:player:lead', function (ev, data) {
      if(data.player !== $scope.$parent.playerName) {
        var lastChar = data.lead.substr(data.lead.length - 1);
        var firstSlice = '';
        var secondSlice = '';
        console.log($scope.sansLeader)

        switch($scope.sansLeader.length - $scope.jokeCheck.length) {
          case 25:
            firstSlice = $scope.sansLeader.slice(0, data.lead.length + 24);
            secondSlice = $scope.sansLeader.slice(data.lead.length + 25);
            break;
          case 26:
            firstSlice = $scope.sansLeader.slice(0, data.lead.length + 18);
            secondSlice = $scope.sansLeader.slice(data.lead.length + 19);
            break;
          case 51:
            firstSlice = $scope.sansLeader.slice(0, data.lead.length + 43);
            secondSlice = $scope.sansLeader.slice(data.lead.length + 44);
            break; 
          default:
            firstSlice = $scope.sansLeader.slice(0, data.lead.length - 1);
            secondSlice = $scope.sansLeader.slice(data.lead.length);
            break;
        }
        $scope.joke = firstSlice +'<span class="leader">'+ lastChar +'</span>'+ secondSlice;
      }
    });

    //
    //
    // Need to check if <span class="leader"></span> is within 
    // the Joke STRING and account for it if it is.
    // 
    // Make it so the <span class="win"></span> doesn't wrap the whole 
    // phrase.
    // 
    // 
    $scope.capture = function (playerInput) {
      var checkInput = playerInput || '';
      var checkAgainst = $scope.jokeCheck;
      var checkIfCorrect = checkAgainst.slice(0, checkInput.length);

      if(checkIfCorrect === checkInput) {
        if(checkIfCorrect === $scope.jokeCheck) {
          socket.emit('player:winner');
        }

        if($scope.joke.length === $scope.jokeCheck.length) {
          $scope.correct = checkIfCorrect;
          $scope.charsLeft = checkAgainst.substr(checkInput.length);
          $scope.joke = '<span class="win">'+ $scope.correct +'</span>'+ $scope.charsLeft;
          $scope.sansLeader = $scope.joke;
          socket.emit('compare:inputs', checkInput);  
        } else {
          $scope.correct = $scope.joke.slice(0, $scope.joke.length);
          $scope.charsLeft = $scope.joke.substr($scope.joke.length);
          $scope.joke = '<span class="win">'+ $scope.correct +'</span>'+ $scope.charsLeft;
          socket.emit('compare:inputs', checkInput);
        }
      } else {
        if($scope.correct) {
          $scope.joke = '<span class="win">'+ $scope.correct +'</span><span class="fail">'+ $scope.charsLeft +'</span>';
          $scope.sansLeader = $scope.joke;
        } else {
          $scope.joke = '<span class="fail">'+ $scope.jokeCheck +'</span>';
          $scope.sansLeader = $scope.joke;
        }
      }
    }

  });