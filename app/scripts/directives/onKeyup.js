'use strict';

angular.module('chuckNorrisAthonApp')
  .directive('onKeyup', function () {
    return function (scope, element, attrs) {
      element.bind('keyup', function (evt) {
        if(evt.keyCode !== 16) {
          scope.$apply(attrs.onKeyup);
        }
      });
    }
  });
