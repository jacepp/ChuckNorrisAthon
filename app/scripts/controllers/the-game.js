'use strict';

angular.module('chuckNorrisAthonApp')
  .controller('TheGameCtrl', function ($scope, $http, socket) {
    $scope.playerInput = '';
    $scope.sansLeader = '';
    $scope.leadChar = '';

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
        $scope.leadChar = data.lead.substr(data.lead.length - 1);
        var firstSlice = '';
        var secondSlice = '';

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
        $scope.joke = firstSlice +'<span class="leader">'+ $scope.leadChar +'</span>'+ secondSlice;
      }
    });

    $scope.capture = function (playerInput) {
      var checkInput = playerInput || '';
      var checkAgainst = $scope.jokeCheck;
      var checkIfCorrect = checkAgainst.slice(0, checkInput.length);

      if(checkIfCorrect === checkInput) {
        if(checkIfCorrect === $scope.jokeCheck) {
          socket.emit('player:winner');
        }

        $scope.correct = checkIfCorrect;
        $scope.charsLeft = checkAgainst.substr(checkInput.length);

        if($scope.joke.indexOf('<span class="leader">') === -1) {
          $scope.joke = '<span class="win">'+ $scope.correct +'</span>'+ $scope.charsLeft;
          $scope.sansLeader = $scope.joke;
          socket.emit('compare:inputs', checkInput);
        } else {
          var findLeader = '';
          if($scope.joke.indexOf('<span class="win">') === -1) {
            findLeader = $scope.joke.indexOf('<span class="leader">');
          } else {
            findLeader = $scope.joke.indexOf('<span class="leader">') - 25;
          }

          var indexCount = findLeader - $scope.correct.length;
          var firstSlice = $scope.charsLeft.slice(0, indexCount);
          var secondSlice = $scope.charsLeft.slice(indexCount + 1);

          if(firstSlice.length !== (secondSlice.length - 1)) {
            $scope.joke = '<span class="win">'+ $scope.correct +'</span>'+ firstSlice +'<span class="leader">'+ $scope.leadChar +'</span>'+ secondSlice;
          } else {
            $scope.joke = '<span class="win">'+ $scope.correct +'</span>'+ $scope.charsLeft;
          }

          socket.emit('compare:inputs', checkInput);
        }
      } else {
        //
        //
        // Need to check if <span class="leader"></span> is within
        // the Joke STRING and account for it if it is.
        //
        //
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