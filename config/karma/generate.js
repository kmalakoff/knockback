const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const glob = require('glob');
const webpack = require('webpack');

const gulp = require('gulp');
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const concat = require('gulp-concat');
const wrapAMD = require('gulp-wrap-amd-infer');

const BABEL_OPTIONS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '.babelrc'), 'utf8'));
const TEST_GROUPS = require('../test_groups');

module.exports = async () => {
  try {
    const configPaths = glob.sync('**/*.webpack.config.js', { cwd: path.join(__dirname, '..', 'builds', 'test'), absolute: true });
    for (const configPath of configPaths) {
      await new Promise((resolve, reject) => {
        const config = _.merge({ output: { path: path.resolve(path.join(__dirname, '..', '..', '_temp/webpack')) } }, require(configPath));
        webpack(config, (err, stats) => {
          if (err) return reject(err);

          console.log(stats.toString({}));
          if (stats.compilation.errors.length) return reject(new Error(`Webpack had ${stats.compilation.errors.length} errors`));
          return resolve();
        });
      });
    }

    // build test browserify
    for (const test of TEST_GROUPS.browserify || []) {
      await new Promise((resolve, reject) =>
        gulp
          .src(test.build.files)
          .pipe(babel(BABEL_OPTIONS))
          .pipe(concat(path.basename(test.build.destination)))
          .pipe(browserify(test.build.options))
          .pipe(gulp.dest(path.dirname(test.build.destination)))
          .on('error', reject)
          .on('end', resolve)
      );
    }

    // wrap AMD tests
    for (const test of TEST_GROUPS.amd || []) {
      await new Promise((resolve, reject) =>
        gulp
          .src(test.build.files)
          .pipe(babel(BABEL_OPTIONS))
          .pipe(wrapAMD(test.build.options))
          .pipe(gulp.dest(test.build.destination))
          .on('error', reject)
          .on('end', resolve)
      );
    }
  } catch (err) {
    console.error(err);
  }
};
