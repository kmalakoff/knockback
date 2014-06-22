// webpack ./src/core/index.js knockback-webpack.js --config webpack.config.js

module.exports = {
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee' }
    ]
  },
  resolve: {
    extensions: ['', '.web.coffee', '.web.js', '.coffee', '.js']
  }
}