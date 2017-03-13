module.exports = {
  module: {
    rules: [{test: /\.coffee$/, loader: 'coffee-loader'}]
  },

  resolve: {
    extensions: ['.coffee', '.js'],
    modules: ['node_modules']
  }
};
