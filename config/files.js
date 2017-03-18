let filename;
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const readdirSyncRecursive = require('fs-readdir-recursive');

const PLUGIN_ENTRIES = {
  defaults: './src/defaults/default-observable.js',
  formatting: './src/formatting/formatted-observable.js',
  localization: './src/localization/localized-observable.js',
  triggering: './src/triggering/triggered-observable.js',
  validation: './src/validation/validation.js',
};

module.exports = {
  libraries: _.flattenDeep(_.map(_.filter(fs.readdirSync('./config/builds/library'), file => (path.extname(file) === '.js') && (file.indexOf('webpack.config.js') >= 0)), file => [file.replace('webpack.config.js', 'js'), file.replace('webpack.config.js', 'min.js')])),

  src_core: _.map(_.filter(fs.readdirSync('./src/core'), file => (path.extname(file) === '.js') && (file !== 'index.js')), file => `./src/core/${file}`),
  src_plugin: _.values(PLUGIN_ENTRIES),

  tests_core: readdirSyncRecursive(`${__dirname}/../test/spec/core`).filter(x => /\.tests.js$/.test(x)).map(x => `./test/spec/core/${x}`),
  tests_plugin: readdirSyncRecursive(`${__dirname}/../test/spec/plugins`).filter(x => /\.tests.js$/.test(x)).map(x => `./test/spec/plugins/${x}`),
  tests_webpack: fs.readdirSync('./config/builds/test').filter(x => path.extname(x) === '.js' && ~x.indexOf('.tests.webpack.config.js')).map(x => `_temp/webpack/${x.replace('.tests.webpack.config.js', '.tests.js')}`),
};
