(function() {
  var exports;

  exports = module.exports = function(app) {
    app.get('/', function(req, res) {
      return res.render('index');
    });
    return app.get('/work', function(req, res) {
      return res.render('work');
    });
  };

}).call(this);
