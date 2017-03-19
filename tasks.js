const path = require('path');
const _ = require('lodash');
const es = require('event-stream');

const gulp = require('gulp');
const webpack = require('gulp-webpack-config');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const spawn = require('cross-spawn');
const nuget = require('nuget');

const nugetGulp = () => es.map((file, callback) =>
  nuget.pack(file, (err, nupkgFile) => {
    if (err) { return callback(err); }
    return nuget.push(nupkgFile, (err) => {
      if (err) return console.log(err);
      return callback();
    });
  }),
);

const HEADER = (module.exports = `\
/*
  <%= file.path.split('/').splice(-1)[0].replace('.min', '') %> <%= pkg.version %>
  Copyright (c)  2011-${(new Date()).getFullYear()} Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/\n\
`);
const LIBRARY_FILES = require('./config/files').libraries;

gulp.task('build', () => gulp.src('config/builds/library/**/*.webpack.config.js')
    .pipe(webpack())
    .pipe(header(HEADER, { pkg: require('./package.json') }))
    .pipe(gulp.dest('.')));

gulp.task('minify', ['build'], () => gulp.src(['knockback.js', 'knockback-*.js', '!*.min.js'])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(HEADER, { pkg: require('./package.json') }))
    .pipe(gulp.dest(file => file.base)));

const testNode = () => new Promise((resolve, reject) => {
  console.log('Running Node tests');
  const res = spawn('mocha', ['test/**/*.tests.js', '--reporter', 'dot', '--recursive']);
  res.stdout.pipe(process.stdout);
  res.stderr.pipe(process.stderr);
  res.on('close', resolve);
  res.on('error', reject);
});

const testBrowsers = async () => {
  console.log('Running Browser tests');
  await require('./config/karma/run')();
};

// gulp.task('test-node', testNode);
gulp.task('test-node', ['build'], testNode);

gulp.task('test-browsers', testBrowsers);
// gulp.task('test-browsers', ['build'], testBrowsers);
// gulp.task('test-browsers', ['minify'], testBrowsers);

gulp.task('test', ['minify'], async () => {
  await testNode();
  await testBrowsers();
});

const copyLibraryFiles = async (destination, others) => {
  await new Promise((resolve, reject) =>
    gulp.src(LIBRARY_FILES.concat(['README.md', 'RELEASE_NOTES.md'].concat(others)))
      .pipe(gulp.dest(file => path.join(destination, path.dirname(file.path).replace(__dirname, ''))))
      .on('error', reject).on('end', resolve),
  );
};

gulp.task('publish', ['minify'], async () => {
  await copyLibraryFiles('packages/npm', ['component.json', 'bower.json']);
  await copyLibraryFiles('packages/nuget/Content/Scripts', []);
  await gulp.src('packages/nuget/*.nuspec').pipe(nugetGulp());
});
