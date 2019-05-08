var path = require('path');
var Queue = require('queue-async');
var Async = require('async');
var es = require('event-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('gulp-webpack-config');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var mocha = require('gulp-mocha');
var nuget = require('nuget');

var nugetGulp = function() {
  return es.map(function(file, callback) {
    return nuget.pack(file, function(err, nupkgFile) {
      if (err) {
        return callback(err);
      }
      return nuget.push(nupkgFile, function(err) {
        if (err) {
          return gutil.log(err);
        } else {
          return callback();
        }
      });
    });
  });
};

var HEADER = (module.exports =
  "/*\n  <%= file.path.split('/').splice(-1)[0].replace('.min', '') %> <%= pkg.version %>\n  Copyright (c)  2011-" +
  new Date().getFullYear() +
  ' Kevin Malakoff.\n  License: MIT (http://www.opensource.org/licenses/mit-license.php)\n  Source: https://github.com/kmalakoff/knockback\n  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).\n  Optional dependencies: Backbone.ModelRef.js and BackboneORM.\n*/\n');

var LIBRARY_FILES = require('./config/files').libraries;

var buildLibraries = function(callback) {
  gulp
    .src('config/builds/library/**/*.webpack.config.coffee')
    .pipe(webpack())
    .pipe(
      header(HEADER, {
        pkg: require('./package.json')
      })
    )
    .pipe(gulp.dest('.'))
    .on('end', callback);
};

gulp.task('build', buildLibraries);

gulp.task('watch', ['build'], function() {
  gulp.watch('./src/**/*.coffee', function() {
    return buildLibraries(function() {});
  });
});

gulp.task('minify', ['build'], function(callback) {
  gulp
    .src(['*.js', '!*.min.js', '!_temp/**/*.js', '!node_modules/'])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(
      header(HEADER, {
        pkg: require('./package.json')
      })
    )
    .pipe(
      gulp.dest(function(file) {
        return file.base;
      })
    )
    .on('end', callback);
});

var testNode = function(callback) {
  var mochaOptions, tag, tags;
  tags = (function() {
    var i, len, ref, results;
    ref = process.argv.slice(3);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      tag = ref[i];
      results.push('@' + tag.replace(/^[-]+/, ''));
    }
    return results;
  })().join(' ');
  mochaOptions = {
    reporter: 'dot',
    compilers: 'coffee:coffee-script/register'
  };
  if (tags) {
    mochaOptions.grep = tags;
  }
  gutil.log('Running Node.js tests ' + tags);
  gulp
    .src('test/spec/**/*.tests.coffee')
    .pipe(mocha(mochaOptions))
    .pipe(es.writeArray(callback));
};

var testBrowsers = function(callback) {
  var tag, tags;
  tags = (function() {
    var i, len, ref, results;
    ref = process.argv.slice(3);
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      tag = ref[i];
      results.push('@' + tag.replace(/^[-]+/, ''));
    }
    return results;
  })().join(' ');
  gutil.log('Running Browser tests ' + tags);
  require('./config/karma/run')(
    {
      tags: tags
    },
    callback
  );
};

gulp.task('test-node', ['build'], testNode);

gulp.task('test-browsers', ['minify'], testBrowsers);

gulp.task('test', ['minify'], function(callback) {
  Async.series([testNode, testBrowsers], function(err) {
    !err || console.log(err);
    return process.exit(err ? 1 : 0);
  });
});

gulp.task('publish', ['minify'], function(callback) {
  var copyLibraryFiles, queue;
  copyLibraryFiles = function(destination, others, callback) {
    return gulp
      .src(LIBRARY_FILES.concat(['README.md', 'RELEASE_NOTES.md'].concat(others)))
      .pipe(
        gulp.dest(function(file) {
          return path.join(destination, path.dirname(file.path).replace(__dirname, ''));
        })
      )
      .on('end', callback);
  };
  queue = new Queue(1);
  queue.defer(function(callback) {
    return copyLibraryFiles('packages/npm', ['component.json', 'bower.json'], callback);
  });
  queue.defer(function(callback) {
    return copyLibraryFiles('packages/nuget/Content/Scripts', [], callback);
  });
  queue.defer(function(callback) {
    return gulp
      .src('packages/nuget/*.nuspec')
      .pipe(nugetGulp())
      .on('end', callback);
  });
  queue.await(function(err) {
    !err || console.log(err);
    return process.exit(err ? 1 : 0);
  });
});
