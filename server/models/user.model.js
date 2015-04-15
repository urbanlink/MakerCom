'use strict';

module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define('User', {
    provider: {
      type      : DataTypes.STRING,
    },
    providerId: {
      type      : DataTypes.STRING,
    },
    email : {
      type      : DataTypes.STRING,
      allowNull : false,
      unique    : true,
      validate  : {
        isEmail: true
      }
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return User;
};
