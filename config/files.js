const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const readdirSyncRecursive = require('fs-readdir-recursive');

module.exports = {
  tests_core: readdirSyncRecursive(`${__dirname}/../test/spec/core`).filter(x => /\.tests.js$/.test(x)).map(x => `./test/spec/core/${x}`),
  tests_plugin: readdirSyncRecursive(`${__dirname}/../test/spec/plugins`).filter(x => /\.tests.js$/.test(x)).map(x => `./test/spec/plugins/${x}`),
  tests_webpack: fs.readdirSync('./config/builds/test').filter(x => path.extname(x) === '.js' && ~x.indexOf('.tests.webpack.config.js')).map(x => `_temp/webpack/${x.replace('.tests.webpack.config.js', '.tests.js')}`),
};
