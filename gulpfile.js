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
  nuget.pack(file, function(err, nupkg_file) {
    if (err) { return callback(err); }
    return nuget.push(nupkg_file, function(err) { if (err) { return gutil.log(err); } else { return callback(); } });
  })
) ;

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

const buildLibraries = function(callback) {
  const errors = [];
  gulp.src('config/builds/library/**/*.webpack.config.js')
    .pipe(webpack())
    .pipe(header(HEADER, {pkg: require('./package.json')}))
    .pipe(gulp.dest('.'))
    .on('end', callback);
};
gulp.task('build', buildLibraries);

gulp.task('watch', ['build'], function() {
  gulp.watch('./src/**/*.coffee', () => buildLibraries(function() {}));
});

gulp.task('minify', ['build'], function(callback) {
  gulp.src(['*.js', '!gulpfile.js', '!*.min.js', '!_temp/**/*.js', '!node_modules/'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(header(HEADER, {pkg: require('./package.json')}))
    .pipe(gulp.dest(file => file.base))
    .on('end', callback);
});

const testNode = function(callback) {
  const tags = (Array.from(process.argv.slice(3)).map((tag) => `@${tag.replace(/^[-]+/, '')}`)).join(' ');

  require('coffee-script/register');
  const mochaOptions = {reporter: 'dot'};
  if (tags) { mochaOptions.grep = tags; }
  gutil.log(`Running Node.js tests ${tags}`);
  gulp.src('test/spec/**/*.tests.coffee')
    .pipe(mocha(mochaOptions))
    .pipe(es.writeArray(callback));
  
};

const testBrowsers = function(callback) {
  const tags = (Array.from(process.argv.slice(3)).map((tag) => `@${tag.replace(/^[-]+/, '')}`)).join(' ');

  gutil.log(`Running Browser tests ${tags}`);
  (require('./config/karma/run'))({tags}, callback);
  
};

gulp.task('test-node', ['build'], testNode);

// gulp.task 'test-browsers', testBrowsers
gulp.task('test-browsers', ['minify'], testBrowsers);

gulp.task('test', ['minify'], function(callback) {
  Async.series([testNode, testBrowsers], function(err) { !err || console.log(err); return process.exit(err ? 1 : 0); });
});

const copyLibraryFiles = (destination, others, callback) =>
  gulp.src(LIBRARY_FILES.concat(['README.md', 'RELEASE_NOTES.md'].concat(others)))
    .pipe(gulp.dest(file => path.join(destination, path.dirname(file.path).replace(__dirname, ''))))
    .on('end', callback)
;

gulp.task('publish', ['minify'], function(callback) {
  const queue = new Queue(1);
  // queue.defer (callback) -> Async.series [testNode, testBrowsers], callback
  queue.defer(callback => copyLibraryFiles('packages/npm', ['component.json', 'bower.json'], callback));
  queue.defer(callback => copyLibraryFiles('packages/nuget/Content/Scripts', [], callback));
  queue.defer(callback =>
    gulp.src('packages/nuget/*.nuspec')
      .pipe(nugetGulp())
      .on('end', callback)
  );
  queue.await(function(err) { !err || console.log(err); return process.exit(err ? 1 : 0); });
});
