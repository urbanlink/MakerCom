'use strict';

angular.module('tiptripApp')

  .factory('AccountSrv', function($rootScope, $http, $auth) {

    return {

      authenticate: function(provider){
        $auth.authenticate(provider).then(function(result){
          $rootScope.user = result.data.user;
        });
      },

      logout: function(){
        $auth.logout().then(function(){
          delete $rootScope.user;
          return true;
        });
      },

      getProfile: function() {
        return $http.get('/api/user/me');
      },

      updateProfile: function(profileData) {
        return $http.put('/api/user/me', profileData);
      }
    };
  });
