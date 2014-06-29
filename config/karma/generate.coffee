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
webpack = require '../gulp-webpack'
browserify = require 'gulp-browserify'

TEST_GROUPS = require('../test_groups')

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

  # # build webpack
  # queue.defer (callback) ->
  #   gulp.src('config/test_bundles/**/*.0.webpack.config.coffee', {read: false, buffer: false})
  #     .pipe(webpack())
  #     .pipe(es.writeArray (err, array) -> callback(err))

  # queue.defer (callback) ->
  #   gulp.src('config/test_bundles/webpack/**/*.webpack.config.coffee', {read: false, buffer: false})
  #     .pipe(webpack())
  #     .pipe(es.writeArray (err, array) -> callback(err))

  # # build commonjs
  # queue.defer (callback) ->
  #   gulp.src('config/test_bundles/**/*.mbundle.config.coffee', {read: false, buffer: false})
  #     .pipe(shell(['./node_modules/.bin/mbundle <%= file.path %>']))
  #     .pipe(es.writeArray (err, array) -> callback())

  # build test browserify
  for test in TEST_GROUPS.browserify
    do (test) -> queue.defer (callback) ->
      test_path = test.files.slice(-1)[0]
      gulp.src(test.tests)
        .pipe(compile({coffee: {bare: true, header: false}}))
        .pipe(concat(path.basename(test_path)))
        .pipe(browserify({
          shim:
            underscore: {path: './vendor/underscore-1.6.0.js', exports: '_'}
            backbone: {path: './vendor/backbone-1.1.2.js', exports: 'Backbone'}
            knockout: {path: './vendor/knockout-3.1.0.js', exports: 'ko'}
            knockback: {path: './knockback.js', exports: 'kb', depends:{underscore: '_', backbone: 'Backbone', knockout: 'ko'}}
            'knockback-examples-localization': {path: './_temp/knockback-examples-localization.js', exports: 'kbel'}
        }))
        .pipe(gulp.dest(path.dirname(test_path)))
        .on('end', callback)

  # # wrap AMD tests
  # for test in TEST_GROUPS.amd
  #   do (test) -> queue.defer (callback) ->
  #     gulp.src(test.original_files.slice(-1)[0])
  #       .pipe(compile({coffee: {bare: true, header: false}}))
  #       .pipe(wrapAMD({
  #         files: test.original_files.slice(0, -1), shims: SHIMS, karma: true, post_load: POST_LOAD,
  #         name: (name) -> return 'knockback' if name is 'knockback-core' then 'knockback' else (if if name is 'lodash' then 'underscore' else file)
  #       }))
  #       .pipe(gulp.dest(test.destination))
  #       .on('end', callback)

  queue.await callback