path = require 'path'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
compile = require 'gulp-compile-js'
modules = require 'gulp-module-system'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'

LIBRARIES = [
  {paths: ['src/core/**/*.coffee'], modules: {type: 'local-shim', file_name: 'knockback.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './'}
  {paths: ['src/core/**/*.coffee'], modules: {type: 'local-shim', file_name: 'knockback-core.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './'}
  {paths: ['src/statistics/**/*.coffee'], modules: {type: 'local-shim', file_name: 'knockback-statistics.js', umd: {symbol: 'kb', dependencies: ['knockback']}}, destination: './lib/'}
]

gulp.task 'build', build = ->
  for library in LIBRARIES
    do (library) ->
      root_paths = (root_path.replace('/**/*.coffee', '') for root_path in library.paths when root_path.indexOf('/**/*.coffee') >= 0)
      gulp.src(library.paths)
        .pipe(es.map (file, callback) -> file.path = file.path.replace("#{path.resolve(dir)}/", '') for dir in root_paths; callback(null, file))
        .pipe(compile({coffee: {bare: true}}))
        .pipe(modules(library.modules))
        .pipe(gulp.dest(library.destination))

gulp.task 'watch', -> gulp.watch './src/**/*.coffee', build
gulp.task 'release', ['build'], ->
