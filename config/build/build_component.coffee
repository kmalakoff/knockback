path = require 'path'
_ = require 'underscore'
es = require 'event-stream'

gulp = require 'gulp'
compile = require 'gulp-compile-js'
modules = require 'gulp-module-system'
header = require 'gulp-header'

HEADER = require './header'
PLUGINS = require './plugins'
MODULE_PATHS = _.flatten((["src/#{plugin}/**/*.coffee", "!src/#{plugin}/index.coffee"] for plugin in ['core'].concat(PLUGINS)))
root_paths = (root_path.replace('/**/*.coffee', '') for root_path in MODULE_PATHS when root_path.indexOf('/**/*.coffee') >= 0)

module.exports = (callback) ->
  return callback()
  gulp.src(MODULE_PATHS)
    .pipe(es.map (file, callback) -> file.path = file.path.replace("#{path.resolve(dir)}/", '') for dir in root_paths; callback(null, file))
    .pipe(compile({coffee: {bare: true, header: false}}))
    .pipe(modules({type: 'local-shim', file_name: 'knockback-component.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}))
    .pipe(header(HEADER, {pkg: require('../../package.json')}))
    .pipe(gulp.dest('./lib'))
    .on('end', callback)
