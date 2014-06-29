_ = require 'underscore'
webpack = require 'webpack'

lines = (array, type) -> return ("#{type}: #{item.message}" for item in array)

module.exports = (config, callback) ->
  # console.log 'building', config
  webpack config, (err, stats) ->
    return callback(err) if err
    console.log '*****WEBPACK*****'
    console.log config.output.filename
    console.log '*****************'
    console.log _.flatten(("added: #{dep.replace(process.cwd(), '')}" for dep in stats.compilation.fileDependencies), lines(stats.compilation.errors, 'error'), lines(stats.compilation.warnings, 'warning')).join('\n')
    console.log '*****************'
    callback()
