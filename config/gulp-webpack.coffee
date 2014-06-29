path = require 'path'
es = require 'event-stream'

webpack = require 'webpack'
gutil = require('gulp-util')
File = gutil.File

module.exports = -> es.map (file, callback) ->
  config = require(file.path)
  webpack config, (err, stats) ->
    return callback(err) if err
    gutil.log stats.toString({})
    return callback(new Error "Webpack had #{stats.compilation.errors.length} errors") if stats.compilation.errors.length
    callback(null, new File({path: path.resolve(path.join(config.output.path, config.output.filename))}))
