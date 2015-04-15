'use strict';

var models = require('../models');

module.exports.me = function(req, res) {
  
  models.User.find(req.user).then(function(user) {
    res.send(user);
  }).catch(function(err){
    console.log('err',err);
  });
};


module.exports.changeMe = function(req,res){

  // User.findById(req.user, function(err, user) {
  //   if (!user) {
  //     return res.status(400).send({ message: 'User not found' });
  //   }
  //   user.displayName = req.body.displayName || user.displayName;
  //   user.email = req.body.email || user.email;
  //   user.save(function(err) {
  //     res.status(200).end();
  //   });
  // });
  res.status(200).end();
};
