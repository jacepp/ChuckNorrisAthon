'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('onKeyupFn', function(socket) {
    return function(scope, elm, attrs) {
      elm.bind('keyup paste', function(evt) {
        if(evt.type == 'paste') {
          elm[0]['value'] = 'Stop Cheating!';
          return false;
        } else {
          var name = attrs.user;
          var phrase = attrs.phrase;
          var userInput = elm[0]['value'].replace(/"/g, '&quot;');
          var phraseCheck = phrase.slice(0, userInput.length);

          if(userInput === phraseCheck) {
            elm.removeClass('wrong-input');
            if(userInput === phrase && userInput !== '') {
              socket.emit('winner:winner', {
                player: name
              });
            } else if (userInput === 'Stop Cheating!'+ phrase) {
              elm[0]['value'] = 'Stop Cheating!';
              return false;
            } else {
              socket.emit('send:message', {
                name: name,
                message: userInput,
                keypress: evt.which
              });
            }
          } else {
            elm.addClass('wrong-input');
          }
        }
      });
    };
  }).
  directive('restrictInput', function(){
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          var transformedInput = inputValue.replace('`', '');

          if (transformedInput!=inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };
  }).
  directive('rightClick',function(){
    document.oncontextmenu = function (e) {
       if(e.target.hasAttribute('right-click')) {
           return false;
       }
    };
    return function(scope,el,attrs){
        el.bind('contextmenu',function(e){
            alert(attrs.alert);               
        }) ;
    };
  });
