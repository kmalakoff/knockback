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
  gulp.src('config/builds/library/**/*.webpack.config.coffee')
    .pipe(webpack())
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

testNode = (callback) ->
  tags = ("@#{tag.replace(/^[-]+/, '')}" for tag in process.argv.slice(3)).join(' ')

  gutil.log "Running Node.js tests #{tags}"
  require './test/lib/node_jquery_xhr' # ensure that globals for the target backend are loaded
  gulp.src('test/spec/**/*.tests.coffee')
    .pipe(mocha({reporter: 'dot', grep: tags}))
    .pipe es.writeArray callback
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

testBrowsers = (callback) ->
  tags = ("@#{tag.replace(/^[-]+/, '')}" for tag in process.argv.slice(3)).join(' ')

  gutil.log "Running Browser tests #{tags}"
  (require './config/karma/run')({tags: tags}, callback)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'test-node', ['minify'], testNode
gulp.task 'test-browsers', ['minify'], testBrowsers
gulp.task 'test', ['minify'], (callback) ->
  Async.series [testNode, testBrowsers], (err) -> process.exit(if err then 1 else 0)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455

gulp.task 'publish', ['minify'], (callback) ->
  copyLibraryFiles = (destination, others, callback) ->
    gulp.src(LIBRARY_FILES.concat(['README.md', 'RELEASE_NOTES.md'].concat(others)))
      .pipe(gulp.dest((file) -> path.join(destination, path.dirname(file.path).replace(__dirname, ''))))
      .on('end', callback)

  queue = new Queue(1)
  # queue.defer (callback) -> Async.series [testNode, testBrowsers], callback
  queue.defer (callback) -> copyLibraryFiles('packages/npm', ['component.json', 'bower.json'], callback)
  queue.defer (callback) -> copyLibraryFiles('packages/nuget/Content/Scripts', [], callback)
  # queue.defer (callback) ->
  #   gulp.src('packages/nuget/*.nuspec')
  #     .pipe(nugetGulp())
  #     .on('end', callback)
  queue.await (err) -> process.exit(if err then 1 else 0)
  return # promises workaround: https://github.com/gulpjs/gulp/issues/455
