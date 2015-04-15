'use strict';

/**
 * # MainCtrl
 * Controller of the tiptripApp
 */
angular.module('makercomApp')
  .controller('HomeCtrl', function ($scope, AccountSrv) {

    $scope.authenticate = function(provider) {
      AccountSrv.authenticate(provider);
    };

    $scope.logout = function(){
      AccountSrv.logout();
    };

  });
