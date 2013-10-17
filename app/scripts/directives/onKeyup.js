'use strict';

angular.module('chuckNorrisAthonApp')
  .directive('onKeyup', function () {
    return function (scope, element, attrs) {
      element.bind('keyup', function () {
        scope.$apply(attrs.onKeyup);
      });
    }
  });
