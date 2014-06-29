fs = require 'fs'
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

    # create a file
    file_path = path.resolve(path.join(config.output.path, config.output.filename))
    file = {cwd: __dirname, contents: new Buffer(fs.readFileSync(file_path, 'utf8'))}
    file.path = file_path.replace(__dirname, '')
    file.base = path.dirname(file.path)
    callback(null, new File(file))
