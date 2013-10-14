'use strict';

angular.module('chuckNorrisAthonApp')
  .directive('stopCheating', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.text('this is the stopCheating directive');
      }
    };
  });
