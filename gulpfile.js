const path = require('path');
const _ = require('underscore');
const Queue = require('queue-async');
const Async = require('async');
const es = require('event-stream');

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('gulp-webpack-config');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const mocha = require('gulp-mocha');
const nuget = require('nuget');

const nugetGulp = () => es.map((file, callback) =>
  nuget.pack(file, (err, nupkgFile) => {
    if (err) { return callback(err); }
    return nuget.push(nupkgFile, (err) => {
      if (err) return gutil.log(err);
      return callback();
    });
  })
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

function buildLibraries(callback) {
  const errors = [];
  gulp.src('config/builds/library/**/*.webpack.config.js')
    .pipe(webpack())
    .pipe(header(HEADER, { pkg: require('./package.json') }))
    .pipe(gulp.dest('.'))
    .on('end', callback);
}
gulp.task('build', buildLibraries);

gulp.task('watch', ['build'], () => {
  gulp.watch('./src/**/*.js', () => buildLibraries(() => {}));
});

gulp.task('minify', ['build'], (callback) => {
  gulp.src(['knockback.js', 'knockback-*.js', '!*.min.js'])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(HEADER, { pkg: require('./package.json') }))
    .pipe(gulp.dest(file => file.base))
    .on('end', callback);
});

function testNode(callback) {
  const mochaOptions = { reporter: 'dot' };
  gutil.log('Running Node.js tests');
  gulp.src('test/spec/**/*.tests.js')
    .pipe(mocha(mochaOptions))
    .pipe(es.writeArray(callback));
}

function testBrowsers(callback) {
  gutil.log('Running Browser tests');
  (require('./config/karma/run'))(callback);
}

// gulp.task('test-node', testNode);
gulp.task('test-node', ['build'], testNode);

// gulp.task('test-browsers', testBrowsers);
// gulp.task('test-browsers', ['build'], testBrowsers);
gulp.task('test-browsers', ['minify'], testBrowsers);

gulp.task('test', ['minify'], (callback) => {
  Async.series([testNode, testBrowsers], (err) => { !err || console.log(err); return process.exit(err ? 1 : 0); });
});

const copyLibraryFiles = (destination, others, callback) =>
  gulp.src(LIBRARY_FILES.concat(['README.md', 'RELEASE_NOTES.md'].concat(others)))
    .pipe(gulp.dest(file => path.join(destination, path.dirname(file.path).replace(__dirname, ''))))
    .on('end', callback)
;

gulp.task('publish', ['minify'], (callback) => {
  const queue = new Queue(1);
  // queue.defer (callback) -> Async.series [testNode, testBrowsers], callback
  queue.defer(callback => copyLibraryFiles('packages/npm', ['component.json', 'bower.json'], callback));
  queue.defer(callback => copyLibraryFiles('packages/nuget/Content/Scripts', [], callback));
  queue.defer(callback =>
    gulp.src('packages/nuget/*.nuspec')
      .pipe(nugetGulp())
      .on('end', callback)
  );
  queue.await((err) => { !err || console.log(err); return process.exit(err ? 1 : 0); });
});
