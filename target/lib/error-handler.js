(function() {
  exports.boot = function(app) {
    var allErrors, clientErrors, logErrors;
    app.log = app.log || function() {
      return console.log.apply(console.log, arguments);
    };
    logErrors = function(err, req, res, next) {
      app.log({
        message: '500 error: ' + err.message,
        err: err
      });
      return next(err);
    };
    clientErrors = function(err, req, res, next) {
      console.log(2);
      if (req.xhr) {
        return res.send(500, {
          error: err.message
        });
      } else {
        return next(err);
      }
    };
    allErrors = function(err, req, res, next) {
      console.log(3);
      res.status(500);
      return res.render('errors/index', {
        error: err
      });
    };
    app.use(logErrors);
    app.use(clientErrors);
    return app.use(allErrors);
  };

  exports.setup404 = function(app) {
    var error404;
    error404 = function(req, res, next) {
      app.log({
        message: '404: ' + req.url
      });
      res.status(404);
      if (req.xhr) {
        return req.send(404);
      } else {
        return res.render('errors/404');
      }
    };
    return app.use(error404);
  };

}).call(this);
