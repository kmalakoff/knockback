path = require 'path'
es = require 'event-stream'
Queue = require 'queue-async'

gulp = require 'gulp'
compile = require 'gulp-compile-js'
modules = require 'gulp-module-system'
concat = require 'gulp-concat'
header = require 'gulp-header'

HEADER = require './header'
STACK_PATHS = ['node_modules/underscore/underscore.js', 'node_modules/backbone/backbone.js', 'node_modules/knockout/build/output/knockout-latest.debug.js']

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

module.exports = (library, callback) ->
  helper = (stream, file_name, callback) ->
    stream
      .pipe(header(HEADER, {pkg: require('../package.json')}))
      .pipe(gulp.dest(library.destination))
      .on('end', callback)

  queue = new Queue(1)
  queue.defer((callback) -> helper(cachedBuild(library), library.modules.file_name, callback))
  queue.defer((callback) -> helper(cachedStackBuild(library), library.stack_file_name, callback)) if library.stack_file_name
  queue.await callback

# HACK UNTIL TROUBLESHOOT
  # gulp.src(['*.js', 'lib/*.js', '!*.min.js', '!lib/*.min.js'])
  #   .pipe(uglify())
  #   .pipe(rename({suffix: '.min'}))
  #   .pipe(header(HEADER, {pkg: require('./package.json')}))
  #   .pipe(gulp.dest((file) -> file.base))
  #   .on('end', callback) # TODO: somewhere there is an extra callback in gulp. do I need to listen to more events?
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'

module.exports.minifyLibrary = (library, callback) ->
  helper = (stream, file_name, callback) ->
    stream
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(header(HEADER, {pkg: require('../package.json')}))
      .pipe(gulp.dest((file) -> file.base))
      .on('end', callback)

  queue = new Queue(1)
  queue.defer((callback) -> helper(cachedBuild(library), library.modules.file_name, callback))
  queue.defer((callback) -> helper(cachedStackBuild(library), library.stack_file_name, callback)) if library.stack_file_name
  queue.await callback
