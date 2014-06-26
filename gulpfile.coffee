path = require 'path'
_ = require 'underscore'
es = require 'event-stream'
Queue = require 'queue-async'
Async = require 'async'

gulp = require 'gulp'
gutil = require 'gulp-util'
compile = require 'gulp-compile-js'
modules = require 'gulp-module-system'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'
concat = require 'gulp-concat'
shell = require 'gulp-shell'
requireSrc = require 'gulp-require-src'
karma = require('karma').server
karma_config = require('./config/karma')

HEADER = """
/*
  <%= file.path.split('/').splice(-1)[0].replace('.min', '') %> <%= pkg.version %>
  Copyright (c)  2011-#{(new Date()).getFullYear()} Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/\n
"""

moduleToBuildOptions = (module) -> {paths: ["src/#{module}/**/*.coffee"], modules: {type: 'local-shim', file_name: "knockback-#{module}.js", umd: {symbol: "knockback-#{module}", dependencies: ['knockback']}}, destination: './lib/'}

MODULES = ['defaults', 'formatting', 'localization', 'triggering', 'validation']
LIBRARIES = (moduleToBuildOptions(module) for module in MODULES)
LIBRARIES.push moduleToBuildOptions('statistics')

# core and full variants
STACK_PATHS = ['node_modules/underscore/underscore.js', 'node_modules/backbone/backbone.js', 'node_modules/knockout/build/output/knockout-latest.debug.js']
MODULE_ADD_PATHS = _.flatten((["src/#{module}/**/*.coffee", "!src/#{module}/index.coffee"] for module in MODULES))
LIBRARIES.push {paths: ['src/core/**/*.coffee'], modules: {type: 'local-shim', file_name: 'knockback-core.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './', stack_file_name: 'knockback-core-stack.js'}
LIBRARIES.push {paths: ['src/core/**/*.coffee'].concat(MODULE_ADD_PATHS), modules: {type: 'local-shim', file_name: 'knockback.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './', stack_file_name: 'knockback-full-stack.js'}

ALL_LIBRARY_FILES = (path.join(library.destination, library.modules.file_name) for library in LIBRARIES)
ALL_LIBRARY_FILES.push path.join(library.destination, library.stack_file_name) for library in LIBRARIES when library.stack_file_name
ALL_LIBRARY_FILES.push library.replace('.js', '.min.js') for library in ALL_LIBRARY_FILES

copyLibraryFiles = (destination, callback) ->
  gulp.src(ALL_LIBRARY_FILES.concat('README.md'))
    .pipe(gulp.dest((file) -> path.join(destination, path.dirname(file.path).replace(__dirname, '')))).on 'end', callback

cachedBuild = (library) ->
  root_paths = (root_path.replace('/**/*.coffee', '') for root_path in library.paths when root_path.indexOf('/**/*.coffee') >= 0)
  return gulp.src(library.paths)
    .pipe(es.map (file, callback) -> file.path = file.path.replace("#{path.resolve(dir)}/", '') for dir in root_paths; callback(null, file))
    .pipe(compile({coffee: {bare: true, header: false}}))
    .pipe(modules(library.modules))
    .pipe(es.map((file, callback) -> console.log "Compiled #{library.modules.file_name}"; callback(null, file)))

cachedStackBuild = (library) ->
  es.merge(gulp.src(STACK_PATHS), cachedBuild(library))
    .pipe(concat(library.stack_file_name))

buildLibrary = (library, callback) ->
  helper = (stream, file_name, callback) ->
    stream
      .pipe(header(HEADER, {pkg: require('./package.json')}))
      .pipe(gulp.dest(library.destination))
      .on 'end', callback

  queue = new Queue(1)
  queue.defer((callback) -> helper(cachedBuild(library), library.modules.file_name, callback))
  queue.defer((callback) -> helper(cachedStackBuild(library), library.stack_file_name, callback)) if library.stack_file_name
  queue.await callback

gulp.task 'build', (callback) -> Async.map(LIBRARIES, buildLibrary, callback)
gulp.task 'watch', ['build'], -> LIBRARIES.map (library) -> gulp.watch library.paths, -> buildLibrary(library)

gulp.task 'minify', ['build'], (callback) ->
  gulp.src(['*.js', '!*.min.js', 'lib/*.js', '!lib/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(header(HEADER, {pkg: require('./package.json')}))
    .pipe(gulp.dest((file) -> file.base))
    .on 'end', callback # somewhere there is an extra callback in gulp. do I need to listen to more events?

gulp.task 'update_packages', (callback) ->
  queue = new Queue(1)
  queue.defer (callback) -> copyLibraryFiles('packages/npm', callback)
  queue.defer (callback) -> copyLibraryFiles('packages/nuget/Content/Scripts', callback)
  queue.await callback
gulp.task 'release', ['test', 'update_packages'], ->

# gulp.task 'test', ['minify'], (callback) ->
gulp.task 'test', (callback) ->
  queue = new Queue(1)

  # queue.defer (callback) -> buildLibrary {paths: ["test_karma/_examples/**/*.coffee"], modules: {type: 'local-shim', file_name: "_localization_examples.js", umd: {symbol: "knockback-locale-manager", dependencies: ['knockback']}}, destination: './test/_examples/build'}, callback

  # # copy dependent libraries
  # queue.defer (callback) -> requireSrc(_.keys(require('./package.json').dependencies), {version: true}).pipe(gulp.dest('vendor')).on 'end', callback
  # queue.defer (callback) -> requireSrc(_.keys(require('./package.json').optionalDependencies), {version: true}).pipe(gulp.dest('vendor/optional')).on 'end', callback

  # # build test bundled modules
  # queue.defer (callback) ->
  #   count = 0
  #   Writable = require('stream').Writable
  #   ws = Writable({objectMode: true})
  #   ws._write = (chunk, enc, next) -> next(); callback() if --count is 0

  #   gulp.src('test/**/_bundle-config.coffee')
  #     .pipe(es.map((file, callback) -> count++; callback(null, file)))
  #     .pipe(shell(['./node_modules/.bin/mbundle <%= file.path %>']))
  #     .pipe(ws)

  # run tests
  for file_info in require('./config/karma_files')
    do (file_info) -> queue.defer (callback) -> console.log "RUNNING TESTS: #{file_info.name}"; karma.start(_.defaults({singleRun: true, files: file_info.files}, karma_config), (return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value) )

  queue.await callback
