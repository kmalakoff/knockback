path = require 'path'
_ = require 'underscore'
es = require 'event-stream'

gulp = require 'gulp'
gutil = require 'gulp-util'
coffee = require 'gulp-coffee'
compile = require 'gulp-compile-js'
modules = require 'gulp-module-system'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'

HEADER = """
/*
  <%= file_name %>
  (c) 2011-2014 Kevin Malakoff.
  Knockback is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
*/\n
"""

MODULES = ['defaults', 'formatting', 'localization', 'statistics', 'triggering', 'validation']
LIBRARIES = ({paths: ["src/#{module}/**/*.coffee"], modules: {type: 'local-shim', file_name: "knockback-#{module}.js", umd: {symbol: "knockback-#{module}", dependencies: ['knockback']}}, destination: './lib/'} for module in MODULES)

# core
STACK_PATHS = ['node_modules/underscore/underscore', 'node_modules/backbone/backbone', 'node_modules/knockout/build/output/knockout-latest.debug.js']
LIBRARIES.push {paths: ['src/core/**/*.coffee'], modules: {type: 'local-shim', file_name: 'knockback-core.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './'}
LIBRARIES.push {paths: ['src/core/**/*.coffee'].concat(STACK_PATHS), modules: {type: 'local-shim', file_name: 'knockback-core-stack.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './'}

# full
MODULE_ADD_PATHS = _.flatten((["src/#{module}/**/*.coffee", "!src/#{module}/index.coffee"] for module in MODULES))
LIBRARIES.push {paths: ['src/core/**/*.coffee'].concat(MODULE_ADD_PATHS), modules: {type: 'local-shim', file_name: 'knockback.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './'}
LIBRARIES.push {paths: ['src/core/**/*.coffee'].concat(MODULE_ADD_PATHS, STACK_PATHS), modules: {type: 'local-shim', file_name: 'knockback-full-stack.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './'}

build = (library) ->
  root_paths = (root_path.replace('/**/*.coffee', '') for root_path in library.paths when root_path.indexOf('/**/*.coffee') >= 0)
  gulp.src(library.paths)
    .pipe(es.map (file, callback) -> file.path = file.path.replace("#{path.resolve(dir)}/", '') for dir in root_paths; callback(null, file))
    .pipe(compile({coffee: {bare: true}}))
    .pipe(modules(library.modules))
    .pipe(header(HEADER, {file_name: library.modules.file_name} ))
    .pipe(gulp.dest(library.destination))

minify = (library) ->
  gulp.src(path.join(library.destination, library.modules.file_name))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(header(HEADER, {file_name: library.modules.file_name} ))
    .pipe(gulp.dest(library.destination))

gulp.task 'build', -> LIBRARIES.map build
gulp.task 'watch', -> LIBRARIES.map (library) -> build(library); gulp.watch library.paths, -> build(library)
gulp.task 'release', ['build'], -> LIBRARIES.map minify

gulp.task 'test', ['release'], ->
  gulp.src('test/**/test.coffee')
    .pipe(compile({coffee: {bare: true}}))
    .pipe(rename (file_path) -> file_path.dirname += '/build'; file_path)
    .pipe(gulp.dest('./test'))
