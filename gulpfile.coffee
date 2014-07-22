path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
Async = require 'async'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
requireSrc = require 'gulp-require-src'
webpack = require 'gulp-webpack-config'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'
mocha = require 'gulp-mocha'
nuget = require 'gulp-nuget-mono'

HEADER = module.exports = """
/*
  <%= file.path.split('/').splice(-1)[0].replace('.min', '') %> <%= pkg.version %>
  Copyright (c)  2011-#{(new Date()).getFullYear()} Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/\n
"""
LIBRARY_FILES = require('./config/files').libraries

gulp.task 'postinstall', (callback) ->
  queue = new Queue(1)
  queue.defer (callback) -> requireSrc(_.keys(require('./package.json').dependencies), {version: true}).pipe(gulp.dest('vendor')).on('end', callback)
  queue.defer (callback) -> requireSrc(_.keys(require('./package.json').optionalDependencies), {version: true}).pipe(gulp.dest('vendor/optional')).on('end', callback)
  queue.await callback

gulp.task 'build', buildLibraries = (callback) ->
  errors = []
  gulp.src('config/builds/library/**/*.webpack.config.coffee', {read: false, buffer: false})
    .pipe(webpack({no_delete: true}))
    .pipe(header(HEADER, {pkg: require('./package.json')}))
    .pipe(gulp.dest('.'))
    .on('end', callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'watch', ['build'], ->
  gulp.watch './src/**/*.coffee', -> buildLibraries(->)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'minify', ['build'], (callback) ->
  gulp.src(['*.js', '!*.min.js', '!_temp/**/*.js', '!node_modules/'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(header(HEADER, {pkg: require('./package.json')}))
    .pipe(gulp.dest((file) -> file.base))
    .on('end', callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-node', ['minify'], testNode = (callback) ->
  gutil.log 'Running Node.js tests'
  require './test/lib/node_jquery_xhr' # ensure that globals for the target backend are loaded
  gulp.src('test/spec/**/*.tests.coffee')
    .pipe(mocha({}))
    .pipe es.writeArray callback
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-browsers', ['minify'], testBrowsers = (callback) ->
  gutil.log 'Running Browser tests'
  (require './config/karma/run')(callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test', ['minify'], (callback) ->
  Async.series [testNode, testBrowsers], (err) -> process.exit(if err then 1 else 0)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-quick', ['build'], testNode

gulp.task 'publish', ['minify'], (callback) ->
  copyLibraryFiles = (destination, others, callback) ->
    gulp.src(LIBRARY_FILES.concat(['README.md'].concat(others)))
      .pipe(gulp.dest((file) -> path.join(destination, path.dirname(file.path).replace(__dirname, ''))))
      .on('end', callback)

  queue = new Queue(1)
  queue.defer (callback) -> Async.series [testNode, testBrowsers], callback
  queue.defer (callback) -> copyLibraryFiles('packages/npm', ['component.json', 'bower.json'], callback)
  queue.defer (callback) -> copyLibraryFiles('packages/nuget/Content/Scripts', [], callback)
  queue.defer (callback) ->
    gulp.src('packages/nuget/*.nuspec')
      .pipe(nuget({pack: true, push: true}))
      .pipe es.writeArray callback
  queue.await (err) -> process.exit(if err then 1 else 0)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455
