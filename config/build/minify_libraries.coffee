gulp = require 'gulp'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
header = require 'gulp-header'

HEADER = require './header'

module.exports = (callback) ->
  gulp.src(['./*.js', '!./*.min.js', '!./_temp/**/*.js', '!./node_modules'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(header(HEADER, {pkg: require('../../package.json')}))
    .pipe(gulp.dest((file) -> file.base))
    .on('end', callback)
