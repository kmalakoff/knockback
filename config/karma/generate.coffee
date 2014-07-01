fs = require 'fs'
path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
shell = require 'gulp-shell'
requireSrc = require 'gulp-require-src'
compile = require 'gulp-compile-js'
concat = require 'gulp-concat'
wrapAMD = require 'gulp-wrap-amd-infer'
webpack = require '../webpack/gulp-webpack'
browserify = require 'gulp-browserify'

TEST_GROUPS = require('../test_groups')

module.exports = (callback) ->
  queue = new Queue(1)

  # # lock vendor until backbone-orm main updated
  # queue.defer (callback) -> requireSrc(_.keys(require('../../package.json').dependencies), {version: true}).pipe(gulp.dest('vendor')).on('end', callback)
  # queue.defer (callback) -> requireSrc(_.keys(require('../../package.json').optionalDependencies), {version: true}).pipe(gulp.dest('vendor/optional')).on('end', callback)

  # build webpack - 0 are dependencies that need to be built before webpack folder
  queue.defer (callback) ->
    gulp.src('config/test_bundles/**/*.0.webpack.config.coffee', {read: false, buffer: false})
      .pipe(webpack())
      .pipe(es.writeArray (err, array) -> callback(err))
  queue.defer (callback) ->
    gulp.src('config/test_bundles/webpack/**/*.webpack.config.coffee', {read: false, buffer: false})
      .pipe(webpack())
      .pipe(es.writeArray (err, array) -> callback(err))

  # build commonjs
  queue.defer (callback) ->
    gulp.src('config/test_bundles/**/*.mbundle.config.coffee', {read: false, buffer: false})
      .pipe(shell(['./node_modules/.bin/mbundle <%= file.path %>']))
      .pipe(es.writeArray (err, array) -> callback())

  # build test browserify
  for test in TEST_GROUPS.browserify or []
    do (test) -> queue.defer (callback) ->
      gulp.src(test.build.files)
        .pipe(compile({coffee: {bare: true}}))
        .pipe(concat(path.basename(test.build.destination)))
        .pipe(browserify(test.build.options))
        .pipe(gulp.dest(path.dirname(test.build.destination)))
        .on('end', callback)

  # wrap AMD tests
  for test in TEST_GROUPS.amd or []
    do (test) -> queue.defer (callback) ->
      gulp.src(test.build.files)
        .pipe(compile({coffee: {bare: true, header: false}}))
        .pipe(wrapAMD(test.build.options))
        .pipe(gulp.dest(test.build.destination))
        .on('end', callback)

  queue.await callback