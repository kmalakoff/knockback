Queue = require 'queue-async'
Wrench = require 'wrench'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
karma = require './karma/run'
mocha = require 'gulp-mocha'

module.exports = (callback) ->
  queue = new Queue(1)

  # run node tests
  # queue.defer (callback) ->
  #   gutil.log 'Running Node.js tests'
  #   gulp.src('test/spec/**/*.tests.coffee')
  #     .pipe(mocha({}))
  #     .pipe es.writeArray (err, array) -> callback(err)

  # run browser tests
  queue.defer (callback) ->
    gutil.log 'Running Browser tests'
    karma(callback)

  queue.await callback
