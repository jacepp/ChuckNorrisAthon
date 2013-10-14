'use strict';

angular.module('chuckNorrisAthonApp')
  .controller('TheGameCtrl', function ($scope, $http) {

    delete $http.defaults.headers.common['X-Requested-With'];
    
    $http.get('http://api.icndb.com/jokes/random').
      success(function(data) {
        $scope.joke = data.value.joke;
      });

  });
