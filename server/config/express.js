'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    path = require('path');


module.exports = function(app){
  var env = app.get('env');
  app.set('port', process.env.PORT || 3000);
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  console.log(path.join(__dirname, '../../client'));
  app.use(express.static(path.join(__dirname, '../../client')));

  // Force HTTPS on Heroku
  // if (app.get('env') === 'production') {
  //   app.use(function(req, res, next) {
  //     var protocol = req.get('x-forwarded-proto');
  //     protocol = 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  //   });
  // }

};
