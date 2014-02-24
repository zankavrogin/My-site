(function() {
  exports.boot = module.exports.boot = function(app) {
    app.use(function(req, res, next) {
      var _ref, _ref1, _ref2, _ref3;
      res.locals.request = req;
      res.locals.loggedIn = !!((_ref = req.session) != null ? (_ref1 = _ref.auth) != null ? _ref1.loggedIn : void 0 : void 0);
      res.locals.messages = (require('express-messages-bootstrap'))(req);
      res.locals.domain = process.env.DOMAIN;
      res.locals.path = ((_ref2 = req.route) != null ? _ref2.path : void 0) || "";
      res.locals.base = (_ref3 = '/' === app.route) != null ? _ref3 : {
        '': app.route
      };
      res.locals.revision = app.settings.revision || '';
      res.locals.mode = app.settings.env;
      res.locals.distinctId = req.sessionID;
      res.locals.user = req.user != null;
      return next();
    });
    app.locals.app = app;
    return app.locals.numberize = function(number) {
      var r;
      r = number.slice(-1, 1);
      if (r === '1') {
        return 'st';
      } else if (r === '2') {
        return 'nd';
      } else if (r === '3') {
        return 'rd';
      } else {
        return 'th';
      }
    };
  };

}).call(this);
