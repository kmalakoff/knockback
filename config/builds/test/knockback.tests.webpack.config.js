const path = require('path');
const glob = require('glob');

const TEST_DIR = path.resolve(path.join(__dirname, '..', '..', '..', 'test'));

module.exports = {
  entry: {
    // TODO: bundle not just core
    'knockback.tests': glob.sync('**/*.tests.js', { cwd: path.join(TEST_DIR, 'knockback-core'), absolute: true })
    // 'knockback.tests': glob.sync('**/*.tests.js', { cwd: path.join(TEST_DIR), absolute: true }),
  },
  mode: 'development',

  module: { rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }] },
  resolve: {
    extensions: ['.js'],
    modules: ['node_modules']
  }
};
