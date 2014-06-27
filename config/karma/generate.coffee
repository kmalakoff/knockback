fs = require 'fs'
path = require 'path'

gulp = require 'gulp'
shell = require 'gulp-shell'
requireSrc = require 'gulp-require-src'
AMDUtils = require './amd_utils'

TEST_GROUPS = require('./test_groups')

module.exports = (callback) ->
  # queue.defer (callback) -> buildLibrary {paths: ["test/_examples/**/*.coffee"], modules: {type: 'local-shim', file_name: "knockback-examples-localization.js", umd: {symbol: "knockback-locale-manager", dependencies: ['knockback']}}, destination: './test/_examples/build'}, callback

  # copy dependent libraries
  # queue.defer (callback) -> requireSrc(_.keys(require('./package.json').dependencies), {version: true}).pipe(gulp.dest('vendor')).on('end', callback)
  # queue.defer (callback) -> requireSrc(_.keys(require('./package.json').optionalDependencies), {version: true}).pipe(gulp.dest('vendor/optional')).on('end', callback)

  # # build test bundled modules
  # queue.defer (callback) ->
  #   count = 0
  #   Writable = require('stream').Writable
  #   ws = Writable({objectMode: true})
  #   ws._write = (chunk, enc, next) -> next(); callback() if --count is 0

  #   gulp.src('test/bundles/**/*.coffee')
  #     .pipe(es.map((file, callback) -> count++; callback(null, file)))
  #     .pipe(shell(['./node_modules/.bin/mbundle <%= file.path %>']))
  #     .pipe(ws)

  for test in TEST_GROUPS.core when (test.name.indexOf('simple_') < 0) and (test.name.indexOf('_min') < 0)
    test_file = test.files.slice(-1)[0]
    dependent_files = test.files.slice(0, -1)

    AMDUtils.wrapTests test_file, dependent_files, (err, wrapped_file) ->
      fs.writeFileSync(path.join('./test/build', "#{test.name}.js"), wrapped_file, 'utf8')

  callback()