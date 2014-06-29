module.exports =
  entry: './src/core/index.coffee'
  output:
    path: '.'
    filename: 'knockback.js'
    library: 'knockback'
    libraryTarget: 'umd'

  module:
    loaders: [{test: /\.coffee$/, loader: 'coffee'}]

  resolve:
    root: './src'
    extensions: ['', '.coffee', '.js']
    moduleDirectories: ['node_modules']

  externals:
    'underscore': '_'
    'backbone': 'Backbone'
    'knockout': 'ko'
    'jquery': 'jQuery'
