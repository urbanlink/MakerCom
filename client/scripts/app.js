'use strict';

/**
 * @ngdoc overview
 * @name tiptripApp
 * @description
 * # tiptripApp
 *
 * Main module of the application.
 */
angular
  .module('tiptripApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'satellizer'
  ])


  .config(function($routeProvider, $locationProvider) {
    // use the HTML5 History API
    $locationProvider.html5Mode(true);
  })

  // Login settings [satellizer]
  .config(function($authProvider) {

    $authProvider.google({
      clientId: '243477111808-gpkb78r2usgkshf69b2n9mrp83ql1r67.apps.googleusercontent.com'
    });
    $authProvider.facebook({
      clientId: '1586845818246603'
    });
  })

  // Application routes
  .config(function($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');

    // Now set up the states
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html'
      });
    })

  .controller('AppCtrl', function($rootScope, $auth, AccountSrv){

    console.log('authenticated: ' + $auth.isAuthenticated());
    if ($auth.isAuthenticated()) {
      AccountSrv.getProfile().success(function(data) {
        console.log('profile: ', data);
        $rootScope.user = data;
      });
    }
  })

  ;
