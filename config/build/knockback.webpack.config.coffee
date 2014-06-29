fs = require 'fs'
path = require 'path'
_ = require 'underscore'

ROOT = './src/core'
FILES = _.map(_.filter(fs.readdirSync(ROOT), (file) -> path.extname(file) is '.coffee' and file isnt 'index.coffee'), (file) -> "#{ROOT}/#{file}")

module.exports = _.extend  _.clone(require '../webpack-base.config.coffee'), {
  entry: _.flatten([FILES, _.values(require './plugin_entries'), ['./src/core/index.coffee']])
  output:
    path: '.'
    filename: 'knockback.js'
    library: 'kb'
    libraryTarget: 'umd'

  externals: [
    {jquery: 'jQuery'}
    {underscore: {root: '_', amd: 'underscore', commonjs: 'underscore', commonjs2: 'underscore'}}
    {backbone: {root: 'Backbone', amd: 'backbone', commonjs: 'backbone', commonjs2: 'backbone'}}
    {knockout: {root: 'ko', amd: 'knockout', commonjs: 'knockout', commonjs2: 'knockout'}}
  ]
}
