const fs = require("fs-extra");
const path = require("path");
const _ = require("underscore");
const Queue = require("queue-async");
const es = require("event-stream");

const gulp = require("gulp");
const gutil = require("gulp-util");
const shell = require("gulp-shell");
const coffee = require("gulp-coffee");
const concat = require("gulp-concat");
// const wrapAMD = require('gulp-wrap-amd-infer');
const webpack = require("gulp-webpack-config");
const browserify = require("gulp-browserify");

const TEST_GROUPS = require("../test_groups");

module.exports = function (options, callback) {
  let test;
  if (options == null) {
    options = {};
  }
  if (options.tags.indexOf("@quick") >= 0) {
    return callback();
  }

  const queue = new Queue(1);

  // install knockback
  queue.defer((callback) =>
    gulp
      .src(["./knockback.js", "./package.json"])
      .pipe(gulp.dest("node_modules/knockback"))
      .on("end", callback)
  );

  // build webpack
  queue.defer((callback) =>
    gulp
      .src(["config/builds/test/**/*.webpack.config.js"], {
        read: false,
        buffer: false,
      })
      .pipe(webpack())
      .pipe(gulp.dest("_temp/webpack"))
      .on("end", callback)
  );

  // build test browserify
  for (test of Array.from(TEST_GROUPS.browserify || [])) {
    ((test) =>
      queue.defer((callback) =>
        gulp
          .src(test.build.files)
          .pipe(coffee({ bare: true }))
          .pipe(concat(path.basename(test.build.destination)))
          .pipe(browserify(test.build.options))
          .pipe(gulp.dest(path.dirname(test.build.destination)))
          .on("end", callback)
      ))(test);
  }

  // // wrap AMD tests
  // for (test of Array.from(TEST_GROUPS.amd || [])) {
  //   ((test => queue.defer(callback => gulp.src(test.build.files)
  //     .pipe(coffee({bare: true, header: false}))
  //     .pipe(wrapAMD(test.build.options))
  //     .pipe(gulp.dest(test.build.destination))
  //     .on('end', callback))))(test);
  // }

  // uninstall knockback
  return queue.await(function (err) {
    fs.removeSync("node_modules/knockback");
    return callback(err);
  });
};
