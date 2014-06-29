path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
Async = require 'async'

gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'
karmaGenerate = require('./config/karma/generate')
karmaRun = require('./config/karma/run')

HEADER = require './config/header'
buildLibrary = require './config/build_library'

moduleToBuildOptions = (module) -> {paths: ["src/#{module}/**/*.coffee"], modules: {type: 'local-shim', file_name: "knockback-#{module}.js", umd: {symbol: "knockback-#{module}", dependencies: ['knockback']}}, destination: './lib/'}

MODULES = ['defaults', 'formatting', 'localization', 'triggering', 'validation']
LIBRARIES = (moduleToBuildOptions(module) for module in MODULES)
LIBRARIES.push moduleToBuildOptions('statistics')

# core and full variants
MODULE_ADD_PATHS = _.flatten((["src/#{module}/**/*.coffee", "!src/#{module}/index.coffee"] for module in MODULES))
LIBRARIES.push {paths: ['src/core/**/*.coffee'], modules: {type: 'local-shim', file_name: 'knockback-core.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './', stack_file_name: 'knockback-core-stack.js'}
LIBRARIES.push {paths: ['src/core/**/*.coffee'].concat(MODULE_ADD_PATHS), modules: {type: 'local-shim', file_name: 'knockback.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './', stack_file_name: 'knockback-full-stack.js'}

ALL_LIBRARY_FILES = (path.join(library.destination, library.modules.file_name) for library in LIBRARIES)
ALL_LIBRARY_FILES.push path.join(library.destination, library.stack_file_name) for library in LIBRARIES when library.stack_file_name
ALL_LIBRARY_FILES.push library.replace('.js', '.min.js') for library in ALL_LIBRARY_FILES

copyLibraryFiles = (destination, callback) ->
  gulp.src(ALL_LIBRARY_FILES.concat('README.md'))
    .pipe(gulp.dest((file) -> path.join(destination, path.dirname(file.path).replace(__dirname, '')))).on('end', callback)

gulp.task 'build', (callback) -> Async.map(LIBRARIES, buildLibrary, callback)
gulp.task 'watch', ['build'], -> LIBRARIES.map (library) -> gulp.watch library.paths, -> buildLibrary(library)

gulp.task 'minify', ['build'], (callback) ->
  Async.map(LIBRARIES, buildLibrary.minifyLibrary, callback)
  # gulp.src(['*.js', 'lib/*.js', '!*.min.js', '!lib/*.min.js'])
  #   .pipe(uglify())
  #   .pipe(rename({suffix: '.min'}))
  #   .pipe(header(HEADER, {pkg: require('./package.json')}))
  #   .pipe(gulp.dest((file) -> file.base))
  #   .on('end', callback) # TODO: somewhere there is an extra callback in gulp. do I need to listen to more events?

gulp.task 'release', ['test'], (callback) ->
  copyLibraryFiles 'packages/npm', (err) -> return callback(err) if err; copyLibraryFiles('packages/nuget/Content/Scripts', callback)

gulp.task 'test', ['minify'], (callback) ->
  queue = new Queue(1)
  queue.defer (callback) -> karmaGenerate(callback)
  queue.defer (callback) -> karmaRun(callback)
  queue.await (err) -> callback(err); process.exit(if err then 1 else 0)
