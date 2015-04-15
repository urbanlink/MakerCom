'use strict';

var config = require('../config/config'),
    request = require('request'),
    models = require('../models'),
    jwt = require('jwt-simple'),
    tokenCtrl = require('./token.controller');

exports.login = function(req, res) {
  res.send({token:'123'});
  // User.findOne({ email: req.body.email }, '+password', function(err, user) {
  //   if (!user) {
  //     return res.status(401).send({ message: 'Wrong email and/or password' });
  //   }
  //   user.comparePassword(req.body.password, function(err, isMatch) {
  //     if (!isMatch) {
  //       return res.status(401).send({ message: 'Wrong email and/or password' });
  //     }
  //     res.send({ token: createToken(user) });
  //   });
  // });
};

exports.signup = function(req, res) {
  res.send({token:'123'});
  // User.findOne({ email: req.body.email }, function(err, existingUser) {
  //   if (existingUser) {
  //     return res.status(409).send({ message: 'Email is already taken' });
  //   }
  //   var user = new User({
  //     displayName: req.body.displayName,
  //     email: req.body.email,
  //     password: req.body.password
  //   });
  //   user.save(function() {
  //     res.send({ token: createToken(user) });
  //   });
  // });
};

exports.google = function(req, res) {
  console.log('auth google');

  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.GOOGLE_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createToken(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createToken(existingUser) });
          }
          var user = new User();
          user.google = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.displayName = profile.name;
          user.save(function(err) {
            var token = createToken(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
};

exports.linkedin = function(req, res) {
  var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.LINKEDIN_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({ message: body.error_description });
    }
    var params = {
      oauth2_access_token: body.access_token,
      format: 'json'
    };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a LinkedIn account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.linkedin = profile.id;
            user.picture = user.picture || profile.pictureUrl;
            user.displayName = user.displayName || profile.firstName + ' ' + profile.lastName;
            user.save(function() {
              var token = createToken(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createToken(existingUser) });
          }
          var user = new User();
          user.linkedin = profile.id;
          user.picture = profile.pictureUrl;
          user.displayName = profile.firstName + ' ' + profile.lastName;
          user.save(function() {
            var token = createToken(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
};

exports.facebook = function(req, res) {
  console.log('Authenticating facebook.');
  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.3/me';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.oauth.facebookSecret,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({
    url: accessTokenUrl,
    qs: params,
    json: true }, function(err, response, accessToken) {

    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }
    accessToken = accessToken.access_token;

    // Step 2. Retrieve profile information about the current user.
    request.get({
      url: graphApiUrl + '?access_token=' + accessToken,
      json: true }, function(err, response, profile) {

      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.headers.authorization) {
        console.log('Checking current user');
        models.User.find({
          where: {
            provider: 'facebook',
            providerId: profile.id
          }
        }).then(function(user) {
          if (user) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.tokenSecret);
          console.log('Checking user based on jwt.');
          models.Users.find({
            where: {
              id: payload.sub
            }
          }).then(function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.providerId = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            console.log('saving user', user);
            user.save(function() {
              //var token = createToken(user);
              res.send({ user: user, token: token });
            });
          });
        });
      } else {
        console.log('new login');
        // Step 3b. Create a new user account or return an existing one.
        models.User.find({
          where: {
            email: profile.email
          }
        }).then(function(user) {
          if (user) {
            var token = tokenCtrl.createToken(user);
            return res.send({ user: user, token: token });
          }
          var newUser = {
            provider: 'facebook',
            providerId: profile.id,
            email: profile.email,
            //picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
            //displayName: profile.name
          };

          models.User.build(newUser).save().then(function(res) {
            var token = tokenCtrl.createToken(user);
            res.send({ user: user, token: token });
          });
        });
      }
    });
  });
};

exports.twitter = function(req,res){

    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var authenticateUrl = 'https://api.twitter.com/oauth/authenticate';

    if (!req.query.oauth_token || !req.query.oauth_verifier) {
      var requestTokenOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        callback: config.TWITTER_CALLBACK
      };

      // Step 1. Obtain request token for the authorization popup.
      request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
        var oauthToken = qs.parse(body);
        var params = qs.stringify({ oauth_token: oauthToken.oauth_token });

        // Step 2. Redirect to the authorization screen.
        res.redirect(authenticateUrl + '?' + params);
      });
    } else {
      var accessTokenOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        token: req.query.oauth_token,
        verifier: req.query.oauth_verifier
      };

      // Step 3. Exchange oauth token and oauth verifier for access token.
      request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, profile) {
        profile = qs.parse(profile);

        // Step 4a. Link user accounts.
        if (req.headers.authorization) {
          User.findOne({ twitter: profile.user_id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Twitter account that belongs to you' });
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.twitter = profile.user_id;
              user.displayName = user.displayName || profile.screen_name;
              user.save(function(err) {
                res.send({ token: createToken(user) });
              });
            });
          });
        } else {
          // Step 4b. Create a new user account or return an existing one.
          User.findOne({ twitter: profile.user_id }, function(err, existingUser) {
            if (existingUser) {
              var token = createToken(existingUser);
              return res.send({ token: token });
            }
            var user = new User();
            user.twitter = profile.user_id;
            user.displayName = profile.screen_name;
            user.save(function() {
              var token = createToken(user);
              res.send({ token: token });
            });
          });
        }
      });
    }

};

exports.unlink = function(req, res) {
  var provider = req.params.provider;
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
};
