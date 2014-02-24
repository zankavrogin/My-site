(function() {
  var express, fs, lessMiddleware, partials, poet;

  express = require('express');

  lessMiddleware = require('less-middleware');

  partials = require('express-partials');

  fs = require('fs');

  poet = require("poet");

  exports.boot = function(app) {
    console.log("7");
    poet = poet(app, {
      posts: "./_posts/",
      postsPerPage: 5,
      metaFormat: "json"
    });
    app.configure(function() {
      poet.init().then(function() {});
      app.set('views', __dirname + './../views');
      app.set('view engine', 'jade');
      console.log("8");
      app.use(express.json());
      app.use(express.urlencoded());
      app.use(express.methodOverride());
      app.use(function(req, res, next) {
        res.header("X-powered-by", "Sharks");
        return next();
      });
      app.use(lessMiddleware({
        src: __dirname + './../public',
        compress: true
      }));
      app.use(express["static"](__dirname + './../public'));
      app.use(require('./coffee-compile')({
        force: true,
        src: __dirname + './../public',
        streamOut: true
      }));
      app.use(express.compress());
      app.use(express.cookieParser('detta-är-en-hemlighet'));
      console.log("9");
      (require('./lib/helpers')).boot(app);
      app.use(partials());
      app.use(express.favicon());
      return app.use(app.router);
    });
    app.set('showStackError', false);
    app.configure('staging', function() {
      return app.enable('view cache');
    });
    app.configure('production', function() {
      return app.enable('view cache');
    });
    return console.log("10");
  };

}).call(this);
