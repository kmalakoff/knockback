fs = require 'fs'
path = require 'path'

CONFIGS = ['./knockback-core.webpack.config', './knockback-core.webpack.config', './knockback-core.webpack.config']
module.exports = []
for config in CONFIGS
  output = require(config).output
  module.exports.push(library_file = path.join(output.path, output.filename))
  module.exports.push(library_file.replace('.js', '.min.js'))
