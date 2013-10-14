'use strict';

describe('Filter: iAmFilter', function () {

  // load the filter's module
  beforeEach(module('chuckNorrisAthonApp'));

  // initialize a new instance of the filter before each test
  var iAmFilter;
  beforeEach(inject(function ($filter) {
    iAmFilter = $filter('iAmFilter');
  }));

  it('should return the input prefixed with "iAmFilter filter:"', function () {
    var text = 'angularjs';
    expect(iAmFilter(text)).toBe('iAmFilter filter: ' + text);
  });

});
