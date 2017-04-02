const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const es = require('event-stream');
const glob = require('glob');
const webpack = require('webpack');

const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const header = require('gulp-header');
const spawn = require('cross-spawn');
const nuget = require('nuget');

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

gulp.task('build', async () => {
  const configPaths = glob.sync('**/webpack.config.js', { cwd: path.join(__dirname, 'packages'), ignore: '**/node_modules/**', absolute: true });
  for (const configPath of configPaths) {
    console.log('configPath', configPath);
    await new Promise((resolve, reject) => {
      webpack(require(configPath), (err, stats) => {
        if (err) return reject(err);

        console.log(stats.toString({}));
        if (stats.compilation.errors.length) return reject(new Error(`Webpack had ${stats.compilation.errors.length} errors`));

//     .pipe(header(HEADER, { pkg: require('./package.json') }))

        return resolve();
      });
    });
  }
});

gulp.task('minify', ['build'], () => gulp.src(['knockback.js', 'knockback-*.js', '!*.min.js'])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(HEADER, { pkg: require('./package.json') }))
    .pipe(gulp.dest(file => file.base)));

const testNode = () => new Promise((resolve, reject) => {
  console.log('Running Node tests');
  const res = spawn('mocha', ['test/**/*.tests.js', '--reporter', 'spec', '--recursive']);
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

// gulp.task('test-browsers', testBrowsers);
// gulp.task('test-browsers', ['build'], testBrowsers);
gulp.task('test-browsers', ['minify'], testBrowsers);

gulp.task('test', ['minify'], async () => {
  await testNode();
  await testBrowsers();
});

const copyLibraryFiles = async (destination, others) => {
  const LIBRARY_FILES = _.flattenDeep(fs.readdirSync(path.join(__dirname, 'config', 'builds', 'library')).map(x => [x.replace('webpack.config.js', 'js'), x.replace('webpack.config.js', 'min.js')]))

  await new Promise((resolve, reject) =>
    gulp.src(LIBRARY_FILES.concat(['README.md', 'RELEASE_NOTES.md'].concat(others)))
      .pipe(gulp.dest(file => path.join(destination, path.dirname(file.path).replace(__dirname, ''))))
      .on('error', reject).on('end', resolve),
  );
};

gulp.task('publish', ['minify'], async () => {
  await copyLibraryFiles('packages/npm', ['component.json', 'bower.json']);
  await copyLibraryFiles('packages/nuget/Content/Scripts', []);
  await gulp.src('packages/nuget/*.nuspec')
    .pipe(es.map((file, callback) =>
      nuget.pack(file, (err, nupkgFile) => {
        if (err) { return callback(err); }
        return nuget.push(nupkgFile, (err) => {
          if (err) return console.log(err);
          return callback();
        });
      })
    ));
});
