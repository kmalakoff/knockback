Queue = require 'queue-async'
Wrench = require 'wrench'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
karma = require './karma/run'
mocha = require 'gulp-mocha'

process.env.NODE_ENV = 'test'

module.exports = (callback) ->
  queue = new Queue(1)

  # run browser tests
  queue.defer (callback) ->
    gutil.log 'Running Broswer tests'
    karma(callback)

  # install knockback
  queue.defer (callback) ->
    gulp.src(['./knockback.js', './package.json'])
      .pipe(gulp.dest('node_modules/knockback'))
      .on('end', callback)

  # run node tests
  queue.defer (callback) ->
    gutil.log 'Running Node.js tests'
    gulp.src('test/knockback/**/*.core.tests.coffee')
      .pipe(mocha({}))
      .pipe(es.writeArray (err, array) -> callback(err))

  queue.await (err) ->
    Wrench.rmdirSyncRecursive('node_modules/knockback', true)
    callback(err)
