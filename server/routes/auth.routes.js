'use strict';

var express = require('express'),
    authCtrl = require('./../controllers/auth.controller'),
    authPerms = require('./../permissions/auth.permission'),
    router = express.Router();


module.exports = function(app){


/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
router.post('/login', authCtrl.login);


/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
router.post('/signup', authCtrl.signup);


/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
router.post('/google', authCtrl.google);


/*
 |--------------------------------------------------------------------------
 | Login with LinkedIn
 |--------------------------------------------------------------------------
 */
router.post('/linkedin', authCtrl.linkedin);


/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
router.post('/facebook', authCtrl.facebook);


/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */
router.get('/twitter', authCtrl.twitter);


/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
router.get('/unlink/:provider',
  authPerms.ensureAuthenticated,
  authCtrl.unlink);

app.use('/auth/', router);

};
