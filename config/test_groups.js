const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const gutil = require('gulp-util');
const glob = require('glob');

const resolveModule = module_name => path.relative('.', require.resolve(module_name));

const KNOCKBACK = {
  browser_globals: ['./knockback.js'],
  browser_globals_min: ['./knockback.min.js'],
  browser_globals_stack: ['./knockback-browser_globals-stack.js'],
  core: ['./knockback-core.js'],
  core_min: ['./knockback-core.min.js'],
  core_stack: ['./knockback-core-stack.js'],
};

const REQUIRED_DEPENDENCIES = {
  backbone_underscore_latest: ['jquery', 'underscore', 'backbone', 'knockout'].map(x => resolveModule(x)),
  backbone_underscore_legacy: ['./vendor/underscore-1.1.7.js', './vendor/backbone-0.5.1.js', './vendor/knockout-2.1.0.js'],
  backbone_lodash_latest: ['lodash', 'backbone', 'knockout'].map(x => resolveModule(x)),
  backbone_lodash_legacy: ['./vendor/lodash-0.3.2.js', './vendor/backbone-0.5.1.js', './vendor/knockout-2.1.0.js'],
  parse_latest_compatibile: ['knockout', 'parse'].map(x => resolveModule(x)),
  parse_legacy: ['knockout'].map(x => resolveModule(x)).concat(['./vendor/parse-1.2.0.js']),
};

const LOCALIZATION_DEPENCIES = ['./test/lib/globalize.js', './test/lib/globalize.culture.en-GB.js', './test/lib/globalize.culture.fr-FR.js'];

const TEST_GROUPS = {};

// ##############################
// Full Library
// ##############################
TEST_GROUPS.browser_globals = [];
for (const library_name in KNOCKBACK) {
  const library_files = KNOCKBACK[library_name];
  if (~library_name.indexOf('browser_globals') && !~library_name.indexOf('stack')) {
    for (const dep_name in REQUIRED_DEPENDENCIES) {
      const dep_files = REQUIRED_DEPENDENCIES[dep_name];
      if (~dep_name.indexOf('backbone')) { // Backbone
        TEST_GROUPS.browser_globals.push({ name: `${dep_name}_${library_name}`, files: _.flattenDeep([dep_files, library_files, LOCALIZATION_DEPENCIES, resolveModule('backbone-modelref'), './test/spec/core/**/*.tests.js', './test/spec/plugins/**/*.tests.js', './test/spec/issues/**/*.tests.js']) });
      } else { // Parse
        TEST_GROUPS.browser_globals.push({ name: `${dep_name}_${library_name}`, files: _.flattenDeep([dep_files, library_files, LOCALIZATION_DEPENCIES, './test/spec/core/**/*.tests.js', './test/spec/plugins/**/*.tests.js']) });
      }
    }
  }
}

// ##############################
// Core Library
// ##############################
TEST_GROUPS.core = [];
for (var test_name in KNOCKBACK) {
  const library_files = KNOCKBACK[test_name];
  if (~test_name.indexOf('core') && !~test_name.indexOf('stack')) {
    TEST_GROUPS.core.push({ name: `core_${test_name}`, files: _.flattenDeep([REQUIRED_DEPENDENCIES.backbone_underscore_latest, library_files, './test/spec/core/**/*.tests.js']) });
  }
}

// ##############################
// ORM
// ##############################
const ORM_TESTS = {
  backbone_orm: [KNOCKBACK.browser_globals, resolveModule('backbone-orm'), './test/spec/ecosystem/**/backbone-orm*.tests.js'],
  backbone_relational: [KNOCKBACK.browser_globals, resolveModule('backbone-relational'), './test/spec/ecosystem/**/backbone-relational*.tests.js'],
  backbone_associations: [KNOCKBACK.browser_globals, resolveModule('backbone-associations'), './test/spec/ecosystem/**/backbone-associations*.tests.js'],
};

TEST_GROUPS.orm = [];
const object = _.pick(REQUIRED_DEPENDENCIES, 'backbone_underscore_latest');
for (const dep_name in object) {
  const dep_files = object[dep_name];
  for (test_name in ORM_TESTS) {
    const test_files = ORM_TESTS[test_name];
    TEST_GROUPS.orm.push({ name: `${dep_name}_${test_name}`, files: _.flattenDeep([dep_files, test_files]) });
  }
}

// ##############################
// AMD
// ##############################
const AMD_OPTIONS = require('./amd/gulp-options');
TEST_GROUPS.amd = [];
TEST_GROUPS.browser_globals.concat(TEST_GROUPS.core).forEach((test) => {
  if (!~test.name.indexOf('_min') && !~test.name.indexOf('legacy_') && !~test.name.indexOf('parse_')) {
    const test_files = test.files.concat(['./node_modules/jquery/dist/jquery.js']);
    const files = [];
    const test_patterns = [];
    const path_files = [];

    _.each(test_files, (file) => {
      if (~file.indexOf('.tests.')) test_patterns.push(file);
      else {
        files.push({ pattern: file, included: false });
        path_files.push(file);
      }
    });
    files.push(`_temp/amd/${test.name}/**/*.js`);
    TEST_GROUPS.amd.push({ name: `amd_${test.name}`, files, build: { files: test_patterns, destination: `_temp/amd/${test.name}`, options: _.extend({ path_files }, AMD_OPTIONS) } });
  }
});

// ##############################
// Webpack
// ##############################
const WEBPACK_TESTS = glob.sync('**/*.tests.webpack.config.js', { cwd: path.join(__dirname, 'build', 'test'), absolute: true });
TEST_GROUPS.webpack = [];
WEBPACK_TESTS.forEach((file) => {
  TEST_GROUPS.webpack.push({ name: `webpack_${file.replace('.js', '')}`, files: _.flattenDeep([(~file.indexOf('core') ? [] : LOCALIZATION_DEPENCIES), file]) });
});

// ##############################
// Browserify
// ##############################
TEST_GROUPS.browserify = [];
const object1 = require('./browserify/tests');
for (test_name in object1) {
  const test_info = object1[test_name];
  TEST_GROUPS.browserify.push({ name: `browserify_${test_name}`, files: _.flattenDeep([(~test_info.files.indexOf('core') ? [] : LOCALIZATION_DEPENCIES), test_info.output]), build: { destination: test_info.output, options: test_info.options, files: test_info.files } });
}

// TEST_GROUPS = {browser_globals: TEST_GROUPS.browser_globals.slice(0, 1)};
// TEST_GROUPS = {amd: TEST_GROUPS.amd.slice(0, 1)};
// TEST_GROUPS = {webpack: TEST_GROUPS.webpack.slice(0, 1)};
// TEST_GROUPS = {browserify: TEST_GROUPS.browserify.slice(0, 1)};
// console.log('TEST_GROUPS', JSON.stringify(TEST_GROUPS));

module.exports = TEST_GROUPS;
