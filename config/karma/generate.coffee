fs = require 'fs'
path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
es = require 'event-stream'

gulp = require 'gulp'
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

  # queue.defer (callback) ->
  #   gulp.src(['knockback.js', 'package.json'])
  #     .pipe(gulp.dest('node_modules/knockback'))
  #     .on('end', callback)

  queue.defer (callback) ->
    gulp.src('config/test_bundles/**/*.webpack.config.coffee', {read: false, buffer: false})
      .pipe(webpack())
      .pipe(es.writeArray (err, array) -> callback(err))

  # # lock vendor until backbone-orm main updated
  # queue.defer (callback) -> requireSrc(_.keys(require('../../package.json').dependencies), {version: true}).pipe(gulp.dest('vendor')).on('end', callback)
  # queue.defer (callback) -> requireSrc(_.keys(require('../../package.json').optionalDependencies), {version: true}).pipe(gulp.dest('vendor/optional')).on('end', callback)

  # build test bundled modules
  queue.defer (callback) ->
    gulp.src('config/test_bundles/**/*.mbundle.config.coffee', {read: false, buffer: false})
      .pipe(shell(['./node_modules/.bin/mbundle <%= file.path %>']))
      .pipe(es.writeArray (err, array) -> callback())

  # wrap AMD tests
  # for test in TEST_GROUPS.core when (test.name.indexOf('simple_') < 0) and (test.name.indexOf('defaults_') < 0) and (test.name.indexOf('_min') < 0)
  #   do (test) -> queue.defer (callback) ->
  #     gulp.src(test.files.slice(-1)[0])
  #       .pipe(compile({coffee: {bare: true, header: false}}))
  #       .pipe(wrapAMD({
  #         files: test.files.slice(0, -1)
  #         shims: SHIMS
  #         karma: true
  #         post_load: POST_LOAD
  #         name: (name) -> if (name is 'knockback-core.js') or ((name.indexOf('knockback-') < 0) and (name.indexOf('globalize') < 0)) then name.split('-').shift() else name
  #       }))
  #       .pipe(gulp.dest('_temp'))
  #       .on('end', callback)

  queue.await callback