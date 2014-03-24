(function() {
  var exports;

  exports = module.exports = function(app) {
    app.get('/', function(req, res) {
      return res.render('index', {homeVar: 'home'});
    });
    return app.get('/work', function(req, res) {
      return res.render('work', {workVar: 'work'});
    });
  };

}).call(this);
