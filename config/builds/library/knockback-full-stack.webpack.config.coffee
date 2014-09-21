fs = require 'fs'
path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../../webpack/base-config.coffee'), {
  entry: _.flatten([require('../../files').src_core, require('../../files').src_plugin, './src/core/index.coffee'])
  output:
    library: 'kb'
    libraryTarget: 'umd2'
    filename: 'knockback-full-stack.js'

  externals: [
    {jquery: {optional: true, root: 'jQuery', amd: 'jquery', commonjs: 'jquery', commonjs2: 'jquery'}}
    {'backbone-relational': {optional: true, root: 'Backbone', amd: 'backbone-relational', commonjs: 'backbone-relational', commonjs2: 'backbone-relational'}}
    {'backbone-associations': {optional: true, root: 'Backbone', amd: 'backbone-associations', commonjs: 'backbone-associations', commonjs2: 'backbone-associations'}}
    {'supermodel': {optional: true, root: 'Supermodel', amd: 'supermodel', commonjs: 'supermodel', commonjs2: 'supermodel'}}
  ]
}
