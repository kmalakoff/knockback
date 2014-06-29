path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'

gulp = require 'gulp'
karmaGenerate = require('./config/karma/generate')
karmaRun = require('./config/karma/run')

LIBRARY_FILES = require './config/build/library_files'
LIBRARIES = require './config/build/libraries'
buildLibrary = require './config/build/build_libraries'
buildLibraries = require './config/build/build_libraries'
minifyLibraries = require './config/build/minify_libraries'

gulp.task 'build', buildLibraries
gulp.task 'watch', ['build'], -> LIBRARIES.map (library) -> gulp.watch library.paths, -> buildLibrary.buildLibrary(library)
gulp.task 'minify', ['build'], (callback) -> minifyLibraries -> # TODO: somewhere there is an extra callback in gulp. do I need to listen to more events?

gulp.task 'release', ['test'], (callback) ->
  copyLibraryFiles = (destination, callback) ->
    gulp.src(ALL_LIBRARY_FILES.concat('README.md'))
      .pipe(gulp.dest((file) -> path.join(destination, path.dirname(file.path).replace(__dirname, '')))).on('end', callback)

  queue = new Queue()
  queue.defer (callback) -> copyLibraryFiles 'packages/npm', callback
  queue.defer (callback) -> copyLibraryFiles('packages/nuget/Content/Scripts', callback)
  queue.await callback

gulp.task 'test', ['minify'], (callback) ->
# gulp.task 'test', (callback) ->
  queue = new Queue(1)
  queue.defer (callback) -> karmaGenerate(callback)
  queue.defer (callback) -> karmaRun(callback)
  queue.await (err) -> callback(err); process.exit(if err then 1 else 0)
