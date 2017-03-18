const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const es = require('event-stream');

const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const wrapAMD = require('gulp-wrap-amd-infer');
const webpack = require('gulp-webpack-config');
const browserify = require('gulp-browserify');

const TEST_GROUPS = require('../test_groups');

module.exports = async () => {
  // install knockback
  await new Promise((resolve, reject) =>
    gulp.src(['./knockback.js', './package.json'])
      .pipe(gulp.dest('node_modules/knockback'))
      .on('error', reject).on('end', resolve),
  );

  // build webpack
  await new Promise((resolve, reject) =>
    gulp.src(['config/builds/test/**/*.webpack.config.js'], { read: false, buffer: false })
      .pipe(webpack())
      .pipe(gulp.dest('_temp/webpack'))
      .on('error', reject).on('end', resolve),
  );

  // build test browserify
  for (const test of (TEST_GROUPS.browserify || [])) {
    await new Promise((resolve, reject) =>
      gulp.src(test.build.files)
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(concat(path.basename(test.build.destination)))
        .pipe(browserify(test.build.options))
        .pipe(gulp.dest(path.dirname(test.build.destination)))
        .on('error', reject).on('end', resolve),
    );
  }

  // wrap AMD tests
  for (const test of (TEST_GROUPS.amd || [])) {
    await new Promise((resolve, reject) =>
      gulp.src(test.build.files)
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(wrapAMD(test.build.options))
        .pipe(gulp.dest(test.build.destination))
        .on('error', reject).on('end', resolve),
    );
  }

  // uninstall knockback
  fs.removeSync('node_modules/knockback', true);
};
