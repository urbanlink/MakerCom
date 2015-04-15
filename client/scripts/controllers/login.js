'use strict';


angular.module('makercomApp')
  .controller('UserCtrl', function ($scope, AccountSrv) {

    $scope.authenticate = function(provider) {
      AccountSrv.authenticate(provider);
    };

    $scope.logout = function(){
      AccountSrv.logout();
    };

  });
