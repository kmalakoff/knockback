const path = require("path");
const _ = require("underscore");
const Queue = require("queue-async");
const es = require("event-stream");

const { src, dest, series } = require("gulp");
const gutil = require("gulp-util");
const webpack = require("gulp-webpack-config");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const header = require("gulp-header");
const mocha = require("gulp-mocha");
const nuget = require("nuget");

const HEADER = `/*
  <%= file.path.split('/').splice(-1)[0].replace('.min', '') %> <%= pkg.version %>
  Copyright (c)  2011-${new Date().getFullYear()} Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/\n`;
const LIBRARY_FILES = require("./config/files").libraries;

function build(callback) {
  const errors = [];
  src("config/builds/library/**/*.webpack.config.js")
    .pipe(webpack())
    .pipe(header(HEADER, { pkg: require("./package.json") }))
    .pipe(dest("."))
    .on("end", callback);
}

function minify(callback) {
  src(["*.js", "!*.min.js", "!_temp/**/*.js", "!node_modules/"])
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(header(HEADER, { pkg: require("./package.json") }))
    .pipe(dest((file) => file.base))
    .on("end", callback);
}

function testNode(callback) {
  const tags = Array.from(process.argv.slice(3))
    .map((tag) => `@${tag.replace(/^[-]+/, "")}`)
    .join(" ");

  const mochaOptions = { reporter: "dot", require: "coffeescript/register" };
  if (tags) {
    mochaOptions.grep = tags;
  }
  gutil.log(`Running Node.js tests ${tags}`);
  src("test/spec/**/*.tests.coffee")
    .pipe(mocha(mochaOptions))
    .pipe(es.writeArray(callback));
}

function testBrowsers(callback) {
  const tags = Array.from(process.argv.slice(3))
    .map((tag) => `@${tag.replace(/^[-]+/, "")}`)
    .join(" ");
  gutil.log(`Running Browser tests ${tags}`);
  require("./config/karma/run")({ tags }, callback);
}

function nugetGulp() {
  return es.map((file, callback) =>
    nuget.pack(file, function (err, nupkg_file) {
      if (err) {
        return callback(err);
      }
      return nuget.push(nupkg_file, function (err) {
        if (err) {
          return gutil.log(err);
        } else {
          return callback();
        }
      });
    })
  );
}

function publish(callback) {
  const copyLibraryFiles = (destination, others, callback) =>
    src(LIBRARY_FILES.concat(["README.md", "RELEASE_NOTES.md"].concat(others)))
      .pipe(
        dest((file) =>
          path.join(destination, path.dirname(file.path).replace(__dirname, ""))
        )
      )
      .on("end", callback);

  const queue = new Queue(1);
  queue.defer((callback) => Async.series([testNode, testBrowsers], callback));
  queue.defer((callback) =>
    copyLibraryFiles("packages/npm", ["component.json", "bower.json"], callback)
  );
  queue.defer((callback) =>
    copyLibraryFiles("packages/nuget/Content/Scripts", [], callback)
  );
  queue.defer((callback) =>
    src("packages/nuget/*.nuspec").pipe(nugetGulp()).on("end", callback)
  );
  queue.await(function (err) {
    !err || console.log(err);
    return process.exit(err ? 1 : 0);
  });
}

exports.build = series(build, minify);
exports["test:node"] = testNode;
exports["test:browsers"] = testBrowsers;
exports.test = series(testNode, testBrowsers);
exports.publish = publish;
exports.default = exports["test:node"];
