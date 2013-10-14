'use strict';

angular.module('chuckNorrisAthonApp')
  .directive('onKeyUp', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var submit;

        $(element).on({
          keydown: function (e) {
            submit = false;

            if (e.which === 13 && !e.shiftKey) {
              submit = true;
              e.preventDefault();
            }
          },

          keyup: function () {
            if (submit) {
              scope.$eval( attrs.enterSubmit );

              // flush model changes manually
              scope.$digest();
            }
          }
        });
      }
    };
  });
