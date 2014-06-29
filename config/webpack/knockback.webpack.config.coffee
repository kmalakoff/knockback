FILES = require './files'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../webpack-base.config.coffee'), {
  entry: _.flatten([FILES.core, FILES.plugins, ['./src/core/index.coffee']])
  output:
    path: '.'
    filename: 'knockback-full-stack.js'
    library: 'kb'
    libraryTarget: 'umd'

  externals: [
    {jquery: 'jQuery'}
    {underscore: {root: '_', amd: 'underscore', commonjs: 'underscore', commonjs2: 'underscore'}}
    {backbone: {root: 'Backbone', amd: 'backbone', commonjs: 'backbone', commonjs2: 'backbone'}}
    {knockout: {root: 'ko', amd: 'knockout', commonjs: 'knockout', commonjs2: 'knockout'}}
  ]
}
