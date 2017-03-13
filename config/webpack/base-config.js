module.exports = {
  module: {
    rules: [{test: /\.js$/, loader: 'babel-loader'}]
  },

  resolve: {
    extensions: ['.js'],
    modules: ['node_modules']
  }
};
