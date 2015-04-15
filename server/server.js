'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize the app
var express = require('express');
var app = express();

// Setup Express
require('./config/express')(app);

// Setup database and models
require('./models');

// Setup Satellizer login
//require('./config/satellizer')(app);

// Setup routes
require('./routes')(app);

// Start the app
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
