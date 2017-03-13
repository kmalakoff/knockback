let filename;
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const readdirSyncRecursive = require('fs-readdir-recursive');

const PLUGIN_ENTRIES = {
  defaults: './src/defaults/default-observable.coffee',
  formatting: './src/formatting/formatted-observable.coffee',
  localization: './src/localization/localized-observable.coffee',
  triggering: './src/triggering/triggered-observable.coffee',
  validation: './src/validation/validation.coffee'
};

module.exports = {
  libraries: _.flatten(_.map(_.filter(fs.readdirSync('./config/builds/library'), file => (path.extname(file) === '.coffee') && (file.indexOf('webpack.config.coffee') >= 0)), file => [file.replace('webpack.config.coffee', 'js'), file.replace('webpack.config.coffee', 'min.js')])),

  src_core: _.map(_.filter(fs.readdirSync('./src/core'), file => (path.extname(file) === '.coffee') && (file !== 'index.coffee')), file => `./src/core/${file}`),
  src_plugin: _.values(PLUGIN_ENTRIES),

  tests_core: ((() => {
    const result = [];
    for (filename of readdirSyncRecursive(__dirname + '/../test/spec/core')) {       if (/\.tests.coffee$/.test(filename)) {
        result.push(`./test/spec/core/${filename}`);
      }
    }
    return result;
  })()),
  tests_plugin: ((() => {
    const result1 = [];
    for (filename of readdirSyncRecursive(__dirname + '/../test/spec/plugins')) {       if (/\.tests.coffee$/.test(filename)) {
        result1.push(`./test/spec/plugins/${filename}`);
      }
    }
    return result1;
  })()),

  tests_webpack: _.map(_.filter(fs.readdirSync('./config/builds/test'), file => (path.extname(file) === '.coffee') && (file.indexOf('.tests.webpack.config.coffee') >= 0)), file => `_temp/webpack/${file.replace('.tests.webpack.config.coffee', '.tests.js')}`)
};
