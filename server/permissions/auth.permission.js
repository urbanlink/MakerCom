'use strict';

var jwt = require('jwt-simple'),
    config = require('../config/config'),
    moment = require('moment');

/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
exports.ensureAuthenticated = function(req, res, next) {

  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = jwt.decode(token, config.oauth.tokenSecret);

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }

  req.user = payload.sub;

  next();
};
