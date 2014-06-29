fs = require 'fs'
path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../webpack-base.config.coffee'), {
  entry: _.flatten([require('../files').src_core, require('../files').src_plugin, './src/core/index.coffee'])
  output:
    path: '.'
    filename: 'knockback-full-stack.js'
    library: 'kb'
    libraryTarget: 'umd'
}
