(function() {
  var clone, coffeeScript, fs, path, url;

  coffeeScript = require("coffee-script");

  fs = require("fs");

  path = require("path");

  url = require("url");

  clone = function(src) {
    var obj, prop, val, _i, _len, _results;
    if (src === Object(src)) {
      if (toString.call(src) === "[object Array]") {
        return src.slice();
      } else {
        obj = {};
        _results = [];
        val = _i = 0;
        _len = src.length;
        while (_i < _len) {
          prop = src[val];
          _results.push(obj[prop] = src[prop]);
          val = ++_i;
        }
        return _results;
      }
    }
  };

  module.exports = function(options) {
    var baseDir, dest, src, _ref;
    if (options == null) {
      options = {};
    }
    if (typeof options === "string") {
      options = {
        src: options
      };
    }
    baseDir = options.baseDir || process.cwd();
    src = options.src;
    if (!src) {
      throw Snew(Error("Coffeescript middleware requires \"src\" directory"));
    }
    src = path.resolve(baseDir, src);
    dest = (options.dest ? options.dest : src);
    dest = path.resolve(baseDir, dest);
    if ((_ref = options.compile) == null) {
      options.compile = function(str, options) {
        return coffeeScript.compile(str, clone(options));
      };
    }
    return function(req, res, next) {
      var coffeePath, compile, error, jsPath, pathname;
      if ("GET" !== req.method && "HEAD" !== req.method) {
        return next();
      }
      pathname = url.parse(req.url).pathname;
      if (/\.js$/.test(pathname)) {
        jsPath = path.join(dest, pathname);
        coffeePath = path.join(src, pathname.replace(".js", ".coffee"));
        error = function(err) {
          var arg;
          arg = ("ENOENT" === err.code ? null : err);
          return next(arg);
        };
        compile = function() {
          return fs.readFile(coffeePath, "utf8", function(err, str) {
            var js;
            if (err) {
              return error(err);
            }
            try {
              js = options.compile(str, options);
            } catch (_error) {
              err = _error;
              return next(err);
            }
            res.setHeader("Content-Type", "text/javascript");
            res.send(js);
          });
        };
        if (options.force) {
          return compile();
        }
        return fs.stat(coffeePath, function(err, coffeeStats) {
          if (err) {
            return error(err);
          }
          return fs.stat(jsPath, function(err, jsStats) {
            if (err) {
              if ("ENOENT" === err.code) {
                return compile();
              } else {
                return next(err);
              }
            } else {
              if (coffeeStats.mtime > jsStats.mtime) {
                return compile();
              } else {
                return next();
              }
            }
          });
        });
      } else {
        return next();
      }
    };
  };

}).call(this);
