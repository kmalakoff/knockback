fs = require 'fs'
path = require 'path'
_ = require 'underscore'

ROOT = './src/core'
FILES = _.map(_.filter(fs.readdirSync(ROOT), (file) -> path.extname(file) is '.coffee' and file isnt 'index.coffee'), (file) -> "#{ROOT}/#{file}")

module.exports = _.extend  _.clone(require '../webpack-base.config.coffee'), {
  entry: _.flatten([FILES, _.values(require './plugin_entries'), ['./src/core/index.coffee']])
  output:
    path: '.'
    filename: 'knockback-full-stack.js'
    library: 'kb'
    libraryTarget: 'umd'
}