const fs = require('fs-extra');
const path = require('path');
const _ = require('underscore');
const Queue = require('queue-async');
const es = require('event-stream');

const gulp = require('gulp');
const gutil = require('gulp-util');
const shell = require('gulp-shell');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const wrapAMD = require('gulp-wrap-amd-infer');
const webpack = require('gulp-webpack-config');
const browserify = require('gulp-browserify');

const TEST_GROUPS = require('../test_groups');
// const TEST_GROUPS = {browser_globals: require('../test_groups').browser_globals.slice(0, 1)};
// const TEST_GROUPS = {amd: require('../test_groups').amd.slice(0, 1)};
// const TEST_GROUPS = {webpack: require('../test_groups').webpack.slice(0, 1)};
// const TEST_GROUPS = {browserify: require('../test_groups').browserify.slice(0, 1)};
// console.log('TEST_GROUPS', JSON.stringify(TEST_GROUPS));

module.exports = function (callback) {
  const queue = new Queue(1);

  // install knockback
  queue.defer(callback =>
    gulp.src(['./knockback.js', './package.json'])
      .pipe(gulp.dest('node_modules/knockback'))
      .on('end', callback)
  );

  // build webpack
  queue.defer(callback =>
    gulp.src(['config/builds/test/**/*.webpack.config.js'], { read: false, buffer: false })
      .pipe(webpack())
      .pipe(gulp.dest('_temp/webpack'))
      .on('end', callback)
  );

  // build test browserify
  for (var test of TEST_GROUPS.browserify || []) {
    (test => queue.defer(callback =>
      gulp.src(test.build.files)
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(concat(path.basename(test.build.destination)))
        .pipe(browserify(test.build.options))
        .pipe(gulp.dest(path.dirname(test.build.destination)))
        .on('end', callback)
    ))(test);
  }

  // wrap AMD tests
  for (test of TEST_GROUPS.amd || []) {
    (test => queue.defer(callback =>
      gulp.src(test.build.files)
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(wrapAMD(test.build.options))
        .pipe(gulp.dest(test.build.destination))
        .on('end', callback)
    ))(test);
  }

  // uninstall knockback
  return queue.await((err) => {
    fs.removeSync('node_modules/knockback', true);
    return callback(err);
  });
};
