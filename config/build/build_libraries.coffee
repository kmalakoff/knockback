Queue = require 'queue-async'
es = require 'event-stream'

gulp = require 'gulp'
webpack = require '../gulp-webpack'

module.exports = (callback) ->
  gulp.src('config/test_bundles/**/*.webpack.config.coffee', {read: false, buffer: false})
    .pipe(webpack())
    .pipe(es.writeArray (err, array) -> callback(err))
