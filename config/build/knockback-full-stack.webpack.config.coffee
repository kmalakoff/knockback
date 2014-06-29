FILES = require './files'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../webpack-base.config.coffee'), {
  entry: _.flatten([FILES.core, _.values(require './plugins'), ['./src/core/index.coffee']])
  output:
    path: '.'
    filename: 'knockback-full-stack.js'
    library: 'kb'
    libraryTarget: 'umd'
}