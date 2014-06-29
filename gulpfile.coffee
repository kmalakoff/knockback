path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'

gulp = require 'gulp'
webpack = require './config/gulp-webpack'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'
karma = require './config/karma/run'

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

gulp.task 'build', buildLibraries = (callback) ->
  gulp.src('config/build/**/*.webpack.config.coffee', {read: false, buffer: false})
    .pipe(webpack())
    .pipe(header(HEADER, {pkg: require('./package.json')}))
    .pipe(gulp.dest((file) -> file.base))
    .on('end', callback)

gulp.task 'watch', ['build'], -> gulp.watch './src/**/*.coffee', (callback) -> buildLibraries(callback)

gulp.task 'minify', (callback) ->
  buildLibraries (err) -> # call manually: dependent task is causing problems
    return callback(err) if err
    gulp.src(['*.js', '!*.min.js', '!_temp/**/*.js', '!node_modules/'])
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(header(HEADER, {pkg: require('./package.json')}))
      .pipe(gulp.dest((file) -> file.base))
      .on('end', ->) # TODO: somewhere there is an extra callback in gulp. do I need to listen to more events?

gulp.task 'release', ['test'], (callback) ->
  copyLibraryFiles = (destination, callback) ->
    gulp.src(require('./config/build/library_files').concat('README.md'))
      .pipe(gulp.dest((file) -> path.join(destination, path.dirname(file.path).replace(__dirname, '')))).on('end', callback)

  queue = new Queue()
  queue.defer (callback) -> copyLibraryFiles('packages/npm', callback)
  queue.defer (callback) -> copyLibraryFiles('packages/nuget/Content/Scripts', callback)
  queue.await callback

gulp.task 'test', ['minify'], (callback) ->
  karma (err) -> callback(err); process.exit(if err then 1 else 0)
