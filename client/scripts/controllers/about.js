'use strict';

/**
 * @ngdoc function
 * @name tiptripApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the tiptripApp
 */
angular.module('tiptripApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
