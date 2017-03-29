const path = require('path');
const _ = require('lodash');
const glob = require('glob');

const TEST_DIR = path.resolve(path.join(__dirname, '..', '..', '..', 'test', 'spec'));

module.exports = {
  entry: {
    'knockback-lodash.tests': [
      ...glob.sync('**/*.tests.js', { cwd: path.join(TEST_DIR, 'core'), absolute: true }),
      ...glob.sync('**/*.tests.js', { cwd: path.join(TEST_DIR, 'plugins'), absolute: true }),
    ],
  },
  module: { rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }] },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
    alias: {
      underscore: require.resolve('lodash'),
      knockback: path.resolve('./knockback.js'),
    },
  },
};
