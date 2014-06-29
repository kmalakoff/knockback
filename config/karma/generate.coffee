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
wrapAMD = require 'gulp-wrap-amd-infer'
webpack = require '../gulp-webpack'

TEST_GROUPS = require('./test_groups')

SHIMS =
  underscore: {exports: '_'}
  backbone: {exports: 'Backbone', deps: ['underscore']}
  knockback: {deps: ['backbone', 'knockout']}
  'globalize.culture.en-GB': {deps: ['globalize']}
  'globalize.culture.fr-FR': {deps: ['globalize']}

POST_LOAD = 'window._ = window.Backbone = window.ko = window.kb = null;'

module.exports = (callback) ->
  queue = new Queue(1)

  # # lock vendor until backbone-orm main updated
  # queue.defer (callback) -> requireSrc(_.keys(require('../../package.json').dependencies), {version: true}).pipe(gulp.dest('vendor')).on('end', callback)
  # queue.defer (callback) -> requireSrc(_.keys(require('../../package.json').optionalDependencies), {version: true}).pipe(gulp.dest('vendor/optional')).on('end', callback)

  # build webpack
  queue.defer (callback) ->
    gulp.src('config/test_bundles/**/*.webpack.config.coffee', {read: false, buffer: false})
      .pipe(webpack())
      .pipe(es.writeArray (err, array) -> callback(err))

  # build test bundled modules
  queue.defer (callback) ->
    gulp.src('config/test_bundles/**/*.mbundle.config.coffee', {read: false, buffer: false})
      .pipe(shell(['./node_modules/.bin/mbundle <%= file.path %>']))
      .pipe(es.writeArray (err, array) -> callback())

  # wrap AMD tests
  for test in TEST_GROUPS.amd
    do (test) -> queue.defer (callback) ->
      test_name = test.original_files.slice(-1)[0]
      dependent_files = test.original_files.slice(0, -1)
      gulp.src(test_name)
        .pipe(compile({coffee: {bare: true, header: false}}))
        .pipe(wrapAMD({
          files: dependent_files, shims: SHIMS, karma: true, post_load: POST_LOAD,
          name: (name) ->
            return 'knockback' if name is 'knockback-core'
            return 'underscore' if name is 'lodash'
            return name
        }))
        .pipe(gulp.dest(test.destination))
        .on('end', callback)

  queue.await callback