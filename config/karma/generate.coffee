fs = require 'fs'
path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
es = require 'event-stream'

gulp = require 'gulp'
shell = require 'gulp-shell'
requireSrc = require 'gulp-require-src'
wrapAMD = require './gulp-wrap-amd-infer'

buildLibrary = require '../build_library'

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
  queue.defer (callback) -> buildLibrary {paths: ["test/lib/**/*.coffee"], modules: {type: 'local-shim', file_name: 'knockback-examples-localization.js', umd: {symbol: 'knockback-locale-manager', dependencies: ['knockback']}}, destination: './test/build'}, callback

  # # lock vendor until backbone-orm main updated
  # queue.defer (callback) -> requireSrc(_.keys(require('../../package.json').dependencies), {version: true}).pipe(gulp.dest('vendor')).on('end', callback)
  # queue.defer (callback) -> requireSrc(_.keys(require('../../package.json').optionalDependencies), {version: true}).pipe(gulp.dest('vendor/optional')).on('end', callback)

  # build test bundled modules
  queue.defer (callback) ->
    count = 0
    Writable = require('stream').Writable
    ws = Writable({objectMode: true})
    ws._write = (chunk, enc, next) -> next(); callback() if --count is 0

    gulp.src('test/bundles/**/*.coffee')
      .pipe(es.map((file, callback) -> count++; callback(null, file)))
      .pipe(shell(['./node_modules/.bin/mbundle <%= file.path %>']))
      .pipe(ws)

  # wrap AMD tests
  for test in TEST_GROUPS.core when (test.name.indexOf('simple_') < 0) and (test.name.indexOf('defaults_') < 0) and (test.name.indexOf('_min') < 0)
    do (test) -> queue.defer (callback) ->
      gulp.src(test.files.slice(-1)[0])
        .pipe(wrapAMD({
          files: test.files.slice(0, -1)
          shims: SHIMS
          karma: true
          post_load: POST_LOAD
          name: (name) -> if (name is 'knockback-core.js') or ((name.indexOf('knockback-') < 0) and (name.indexOf('globalize') < 0)) then name.split('-').shift() else name}))
        .pipe(gulp.dest('test/build'))
        .on('end', callback)

  queue.await callback