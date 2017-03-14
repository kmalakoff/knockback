let filename;
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const readdirSyncRecursive = require('fs-readdir-recursive');

const PLUGIN_ENTRIES = {
  defaults: './src/defaults/default-observable.js',
  formatting: './src/formatting/formatted-observable.js',
  localization: './src/localization/localized-observable.js',
  triggering: './src/triggering/triggered-observable.js',
  validation: './src/validation/validation.js',
};

module.exports = {
  libraries: _.flatten(_.map(_.filter(fs.readdirSync('./config/builds/library'), file => (path.extname(file) === '.js') && (file.indexOf('webpack.config.js') >= 0)), file => [file.replace('webpack.config.js', 'js'), file.replace('webpack.config.js', 'min.js')])),

  src_core: _.map(_.filter(fs.readdirSync('./src/core'), file => (path.extname(file) === '.js') && (file !== 'index.js')), file => `./src/core/${file}`),
  src_plugin: _.values(PLUGIN_ENTRIES),

  tests_core: ((() => {
    const result = [];
    readdirSyncRecursive(`${__dirname}/../test/spec/core`).forEach(filename => {
      if (/\.tests.js$/.test(filename)) {
        result.push(`./test/spec/core/${filename}`);
      }
    });
    return result;
  })()),
  tests_plugin: ((() => {
    const result1 = [];
    readdirSyncRecursive(`${__dirname}/../test/spec/plugins`).forEach(filename => {
      if (/\.tests.js$/.test(filename)) {
        result1.push(`./test/spec/plugins/${filename}`);
      }
    });
    return result1;
  })()),

  tests_webpack: _.map(_.filter(fs.readdirSync('./config/builds/test'), file => (path.extname(file) === '.js') && (file.indexOf('.tests.webpack.config.js') >= 0)), file => `_temp/webpack/${file.replace('.tests.webpack.config.js', '.tests.js')}`),
};
