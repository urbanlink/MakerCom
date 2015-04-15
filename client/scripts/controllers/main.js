'use strict';

/**
 * @ngdoc function
 * @name tiptripApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tiptripApp
 */
angular.module('tiptripApp')
  .controller('HomeCtrl', function ($scope, AccountSrv) {

    $scope.authenticate = function(provider) {
      AccountSrv.authenticate(provider);
    };

    $scope.logout = function(){
      AccountSrv.logout();
    };

  });
