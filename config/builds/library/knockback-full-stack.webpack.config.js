const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = _.extend(_.clone(require('../../webpack/base-config')), {
  entry: _.flattenDeep([require('../../files').src_plugin, './src/core/index.js']),
  output: {
    library: 'kb',
    libraryTarget: 'umd2',
    filename: 'knockback-full-stack.js',
  },

  externals: [
    { 'backbone-relational': { optional: true, root: 'Backbone', amd: 'backbone-relational', commonjs: 'backbone-relational', commonjs2: 'backbone-relational' } },
    { 'backbone-associations': { optional: true, root: 'Backbone', amd: 'backbone-associations', commonjs: 'backbone-associations', commonjs2: 'backbone-associations' } },
  ],
});
