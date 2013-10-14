'use strict';

angular.module('chuckNorrisAthonApp', ['ngSanitize', 'btford.socket-io'])
  .config(function (socketProvider) {
    var mySocket = io.connect('http://localhost:3000');
    socketProvider.ioSocket(mySocket);
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/thunder-dome', {
        templateUrl: 'views/thunder-dome.html',
        controller: 'ThunderDomeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
