'use strict';

angular.module('chuckNorrisAthonApp')
  .directive('onKeyup', function (socket) {
    return function (scope, element, attrs) {
      element.bind('keyup', function (evt) {
        if(evt.keyCode !== 16) {
          scope.$apply(attrs.onKeyup);
        }

        socket.forward('game:new', scope);
        scope.$on('socket:game:new', function (ev, data) {
          element[0]['value'] = '';
        });
      });
    }
  });
