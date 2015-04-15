'use strict';

var express = require('express'),
    userCtrl = require('./../controllers/user.controller'),
    authPerms = require('./../permissions/auth.permission'),
    router = express.Router();


module.exports = function(app){

  /*
   |--------------------------------------------------------------------------
   | GET /api/me
   |--------------------------------------------------------------------------
   */
  router.get('/me',
    authPerms.ensureAuthenticated,
    userCtrl.me);

  /*
   |--------------------------------------------------------------------------
   | PUT /api/me
   |--------------------------------------------------------------------------
   */
  router.put('/me',
    authPerms.ensureAuthenticated,
    userCtrl.changeMe);


  app.use('/api/user/', router);

};
