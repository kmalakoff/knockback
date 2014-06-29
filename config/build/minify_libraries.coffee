# HACK UNTIL TROUBLESHOOT
  # gulp.src(['*.js', 'lib/*.js', '!*.min.js', '!lib/*.min.js'])
  #   .pipe(uglify())
  #   .pipe(rename({suffix: '.min'}))
  #   .pipe(header(HEADER, {pkg: require('./package.json')}))
  #   .pipe(gulp.dest((file) -> file.base))
  #   .on('end', callback) # TODO: somewhere there is an extra callback in gulp. do I need to listen to more events?
Async = require 'async'
Queue = require 'queue-async'

gulp = require 'gulp'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'

HEADER = require './header'
LIBRARIES = require './libraries'
buildLibrary = require './build_library'

minifyLibrary = (library, callback) ->
  helper = (stream, file_name, callback) ->
    stream
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(header(HEADER, {pkg: require('../../package.json')}))
      .pipe(gulp.dest(library.destination))
      .on('end', callback)

  queue = new Queue()
  queue.defer((callback) -> helper(buildLibrary.cachedBuild(library), library.modules.file_name, callback))
  queue.defer((callback) -> helper(buildLibrary.cachedStackBuild(library), library.stack_file_name, callback)) if library.stack_file_name
  queue.await callback

module.exports = (callback) -> Async.each LIBRARIES, minifyLibrary, callback
