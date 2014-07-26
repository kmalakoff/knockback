path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
Async = require 'async'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
webpack = require 'gulp-webpack-config'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'
mocha = require 'gulp-mocha'
nuget = require 'nuget'
nugetGulp = -> es.map (file, callback) ->
  nuget.pack file, (err, nupkg_file) ->
    return callback(err) if err
    nuget.push nupkg_file, (err) -> if err then gutil.log(err) else callback()

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

testNodeFn = (options={}) -> (callback) ->
  gutil.log "Running Node.js tests #{if options.quick then '(quick)' else ''}"
  require './test/lib/node_jquery_xhr' # ensure that globals for the target backend are loaded
  mocha_options = if options.quick then {grep: '@quick'} else {}
  gulp.src('test/spec/**/*.tests.coffee')
    .pipe(mocha(_.extend({reporter: 'dot'}, mocha_options)))
    .pipe es.writeArray callback
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

testBrowsersFn = (options={}) -> (callback) ->
  gutil.log "Running Browser tests #{if options.quick then '(quick)' else ''}"
  (require './config/karma/run')(options, callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-node', ['minify'], testNodeFn()
gulp.task 'test-browsers', ['minify'], testBrowsersFn()
gulp.task 'test', ['minify'], (callback) ->
  Async.series [testNodeFn(), testBrowsersFn()], (err) -> process.exit(if err then 1 else 0)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-node-quick', ['build'], testNodeFn({quick: true})
gulp.task 'test-browsers-quick', ['build'], testBrowsersFn({quick: true})
gulp.task 'test-quick', ['build'], (callback) ->
  Async.series [testNodeFn({quick: true}), testBrowsersFn({quick: true})], (err) -> if err then process.exit(1) else callback(err)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'publish', ['minify'], (callback) ->
  copyLibraryFiles = (destination, others, callback) ->
    gulp.src(LIBRARY_FILES.concat(['README.md'].concat(others)))
      .pipe(gulp.dest((file) -> path.join(destination, path.dirname(file.path).replace(__dirname, ''))))
      .on('end', callback)

  queue = new Queue(1)
  queue.defer (callback) -> Async.series [testNodeFn(), testBrowsersFn()], callback
  queue.defer (callback) -> copyLibraryFiles('packages/npm', ['component.json', 'bower.json'], callback)
  queue.defer (callback) -> copyLibraryFiles('packages/nuget/Content/Scripts', [], callback)
  # queue.defer (callback) ->
  #   gulp.src('packages/nuget/*.nuspec')
  #     .pipe(nugetGulp())
  #     .on('end', callback)
  queue.await (err) -> process.exit(if err then 1 else 0)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455
