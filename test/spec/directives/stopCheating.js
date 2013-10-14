'use strict';

describe('Directive: stopCheating', function () {

  // load the directive's module
  beforeEach(module('chuckNorrisAthonApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<stop-cheating></stop-cheating>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the stopCheating directive');
  }));
});
