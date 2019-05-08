var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var readdirSyncRecursive = require('fs-readdir-recursive');

var PLUGIN_ENTRIES = {
  defaults: './src/defaults/default-observable.coffee',
  formatting: './src/formatting/formatted-observable.coffee',
  localization: './src/localization/localized-observable.coffee',
  triggering: './src/triggering/triggered-observable.coffee',
  validation: './src/validation/validation.coffee'
};

module.exports = {
  libraries: _.flatten(
    _.map(
      _.filter(fs.readdirSync('./config/builds/library'), function(file) {
        return path.extname(file) === '.coffee' && file.indexOf('webpack.config.coffee') >= 0;
      }),
      function(file) {
        return [file.replace('webpack.config.coffee', 'js'), file.replace('webpack.config.coffee', 'min.js')];
      }
    )
  ),
  src_core: _.map(
    _.filter(fs.readdirSync('./src/core'), function(file) {
      return path.extname(file) === '.coffee' && file !== 'index.coffee';
    }),
    function(file) {
      return './src/core/' + file;
    }
  ),
  src_plugin: _.values(PLUGIN_ENTRIES),
  tests_core: (function() {
    var ref = readdirSyncRecursive(path.join(__dirname, '/../test/spec/core'));
    var results = [];
    for (var i = 0, len = ref.length; i < len; i++) {
      var filename = ref[i];
      if (/\.tests.coffee$/.test(filename)) {
        results.push('./test/spec/core/' + filename);
      }
    }
    return results;
  })(),
  tests_plugin: (function() {
    var ref = readdirSyncRecursive(path.join(__dirname, '/../test/spec/plugins'));
    var results = [];
    for (var i = 0, len = ref.length; i < len; i++) {
      var filename = ref[i];
      if (/\.tests.coffee$/.test(filename)) {
        results.push('./test/spec/plugins/' + filename);
      }
    }
    return results;
  })(),
  tests_webpack: _.map(
    _.filter(fs.readdirSync('./config/builds/test'), function(file) {
      return path.extname(file) === '.coffee' && file.indexOf('.tests.webpack.config.coffee') >= 0;
    }),
    function(file) {
      return '_temp/webpack/' + file.replace('.tests.webpack.config.coffee', '.tests.js');
    }
  )
};
