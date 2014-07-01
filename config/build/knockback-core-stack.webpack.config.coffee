fs = require 'fs'
path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../webpack/base-config.coffee'), {
  entry: _.flatten([require('../files').src_core, './src/core/index.coffee'])
  output:
    path: '.'
    filename: 'knockback-core-stack.js'
    library: 'kb'
    libraryTarget: 'umd'
}
