path = require 'path'

module.exports =
  entry: './test/knockback/core.tests.coffee'
  output:
    path: '.'
    filename: '_temp/webpack-core.tests.js'

  module:
    loaders: [{ test: /\.coffee$/, loader: 'coffee'}]

  resolve:
    root: '.'
    extensions: ['', '.web.coffee', '.web.js', '.coffee', '.js']
    moduleDirectories: ['node_modules']
