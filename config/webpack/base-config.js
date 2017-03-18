module.exports = {
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },

  resolve: {
    extensions: ['.js'],
    modules: ['node_modules'],
  },
};
