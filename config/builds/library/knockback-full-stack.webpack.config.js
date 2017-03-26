const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const PLUGINS_DIR = path.resolve(path.join(__dirname, '..', '..', '..', 'src', 'plugins'));

module.exports = _.extend(_.clone(require('../../webpack/base-config')), {
  entry: fs.readdirSync(PLUGINS_DIR).map(x => path.join(PLUGINS_DIR, x, 'index.js')).concat(['./src/core/index.js']),
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
