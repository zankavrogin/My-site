(function() {
  var app, errors, express, mongoose, port, settings;

  console.log(".01");

  express = require("express");

  app = express();

  port = process.env.PORT || 8080;

  mongoose = require('mongoose');

  settings = require('./settings');

  errors = require('./lib/error-handler');

  console.log(".1");

  mongoose.connection.on('open', function() {
    var controller_files, controller_loc, model_files, model_loc, server;
    console.log("1");
    settings.boot(app);
    errors.boot(app);
    app.models = {};
    model_loc = __dirname + '/models';
    model_files = (require('fs')).readdirSync(model_loc);
    model_files.forEach(function(file) {
      return (require(model_loc + '/' + file)).boot(app);
    });
    console.log("2");
    controller_loc = __dirname + '/controllers';
    controller_files = (require('fs')).readdirSync(controller_loc);
    controller_files.forEach(function(file) {
      return (require(controller_loc + '/' + file))(app);
    });
    console.log("3");
    errors.setup404(app);
    server = app.listen(port);
    console.log("Express-Boilerplate started on port " + port);
    return console.log("4");
  });

  mongoose.connect("mongodb://127.0.0.1/test");

  console.log("5");

}).call(this);
