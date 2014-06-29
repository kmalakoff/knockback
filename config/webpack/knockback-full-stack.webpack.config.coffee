FILES = require './files'
_ = require 'underscore'

module.exports =
  entry: _.flatten([FILES.core, FILES.plugins, ['./src/core/index.coffee']])
  output:
    path: '.'
    filename: 'knockback-full-stack.js'
    library: 'kb'
    libraryTarget: 'umd'

  module:
    loaders: [{test: /\.coffee$/, loader: 'coffee'}]

  resolve:
    extensions: ['', '.coffee', '.js']
