fs = require 'fs'
path = require 'path'
_ = require 'underscore'

ROOT = './config/build'
FILES = _.map(_.filter(fs.readdirSync(ROOT), (file) -> path.extname(file) is '.coffee' and file.indexOf('webpack.config.coffee') >= 0), (file) -> "./#{file}")

module.exports = []
for config in FILES
  output = require(config).output
  module.exports.push(library_file = path.join(output.path, output.filename))
  module.exports.push(library_file.replace('.js', '.min.js'))
