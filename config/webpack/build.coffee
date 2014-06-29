_ = require 'underscore'
webpack = require 'webpack'

module.exports = (config, callback) ->
  console.log 'building', config
  webpack config, (err, stats) ->
    console.log 'webpack', err, _.pluck(stats.compilation.warnings, 'message')
    console.log 'webpack', err, _.pluck(stats.compilation.errors, 'message')
    console.log 'webpack', err, (dep.replace(process.cwd(), '') for dep in stats.compilation.fileDependencies)
    callback(err)
