const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    filename: 'knockback-knockback.js',
    path: path.join(__dirname, 'dist'),
    library: 'kb',
    libraryTarget: 'umd2',
  },

  module: { rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }] },
  resolve: { extensions: ['.js'], modules: ['node_modules'] },

  externals: [
    { underscore: { root: '_', amd: 'underscore', commonjs: 'underscore', commonjs2: 'underscore' } },
    { backbone: { root: 'Backbone', amd: 'backbone', commonjs: 'backbone', commonjs2: 'backbone' } },
    { knockout: { root: 'ko', amd: 'knockout', commonjs: 'knockout', commonjs2: 'knockout' } },
    { '@knockback/backbone-associations': { optional: true, root: 'Backbone', amd: 'backbone-associations', commonjs: 'backbone-associations', commonjs2: 'backbone-associations' } },
    { '@knockback/backbone-relational': { optional: true, root: 'Backbone', amd: 'backbone-relational', commonjs: 'backbone-relational', commonjs2: 'backbone-relational' } },
  ],
};
