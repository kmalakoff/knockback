const path = require('path');
const _ = require('lodash');
const glob = require('glob');

const resolveModule = module_name => path.relative('.', require.resolve(module_name));

const KNOCKBACK = {
  // browser_globals: [resolveModule('@knockback/knockback')],
  browser_globals: [resolveModule('knockback')],
  // browser_globals_legacy: [resolveModule('knockback')],
  // browser_globals_min: ['./knockback.min.js'],
  // core: [resolveModule('@knockback/core')],
  // core_min: ['./knockback-core.min.js'],
};

const REQUIRED_DEPENDENCIES = {
  backbone_underscore_latest: ['jquery', 'underscore', 'backbone', 'knockout'].map(x => resolveModule(x)),
  // backbone_underscore_legacy: ['./vendor/underscore-1.1.7.js', './vendor/backbone-0.5.1.js', './vendor/knockout-2.1.0.js'],
  // backbone_lodash_latest: ['lodash', 'backbone', 'knockout'].map(x => resolveModule(x)),
  // backbone_lodash_legacy: ['./vendor/lodash-0.3.2.js', './vendor/backbone-0.5.1.js', './vendor/knockout-2.1.0.js'],
};

const LOCALIZATION_DEPENCIES = ['./test/lib/globalize.js', './test/lib/globalize.culture.en-GB.js', './test/lib/globalize.culture.fr-FR.js'];

const TEST_GROUPS = {};

// ##############################
// Full Library
// ##############################
TEST_GROUPS.browser_globals = [];
_.each(KNOCKBACK, (library_files, library_name) => {
  if (!~library_name.indexOf('browser_globals')) return;
  _.each(REQUIRED_DEPENDENCIES, (dep_files, dep_name) => {
    TEST_GROUPS.browser_globals.push({
      name: `${dep_name}_${library_name}`,
      files: _.flattenDeep([
        dep_files,
        library_files,
        LOCALIZATION_DEPENCIES,
        resolveModule('backbone-modelref'),
        './test/**/*.tests.js',
      ]),
    });
  });
});

// ##############################
// Core Library
// ##############################
TEST_GROUPS.core = [];
_.each(KNOCKBACK, (library_files, test_name) => {
  if (~test_name.indexOf('core') && !~test_name.indexOf('stack')) {
    TEST_GROUPS.core.push({ name: `core_${test_name}`, files: _.flattenDeep([REQUIRED_DEPENDENCIES.backbone_underscore_latest, library_files, './test/knockback-core/**/*.tests.js']) });
  }
});

// ##############################
// ORM
// ##############################
const ORM_TESTS = {
  backbone_orm: [KNOCKBACK.browser_globals, resolveModule('backbone-orm'), './test/ecosystem/**/backbone-orm*.tests.js'],
  backbone_relational: [KNOCKBACK.browser_globals, resolveModule('backbone-relational'), './test/ecosystem/**/backbone-relational*.tests.js'],
  backbone_associations: [KNOCKBACK.browser_globals, resolveModule('backbone-associations'), './test/ecosystem/**/backbone-associations*.tests.js'],
};

TEST_GROUPS.orm = [];
// _.each(_.pick(REQUIRED_DEPENDENCIES, 'backbone_underscore_latest'), (dep_files, dep_name) => {
//   _.each(ORM_TESTS, (test_files, test_name) => {
//     TEST_GROUPS.orm.push({ name: `${dep_name}_${test_name}`, files: _.flattenDeep([dep_files, test_files]) });
//   });
// });

// ##############################
// AMD
// ##############################
const AMD_OPTIONS = require('./amd/gulp-options');

TEST_GROUPS.amd = [];
// TEST_GROUPS.browser_globals.concat(TEST_GROUPS.core).forEach((test) => {
//   if (!~test.name.indexOf('_min') && !~test.name.indexOf('legacy_') && !~test.name.indexOf('parse_')) {
//     const test_files = test.files.concat(['./node_modules/jquery/dist/jquery.js']);
//     const files = [];
//     const test_patterns = [];
//     const path_files = [];

//     _.each(test_files, (file) => {
//       if (~file.indexOf('.tests.')) test_patterns.push(file);
//       else {
//         files.push({ pattern: file, included: false });
//         path_files.push(file);
//       }
//     });
//     files.push(`_temp/amd/${test.name}/**/*.js`);
//     TEST_GROUPS.amd.push({ name: `amd_${test.name}`, files, build: { files: test_patterns, destination: `_temp/amd/${test.name}`, options: _.extend({ path_files }, AMD_OPTIONS) } });
//   }
// });

// ##############################
// Webpack
// ##############################
const WEBPACK_TESTS = glob.sync('**/*.tests.webpack.config.js', { cwd: path.join(__dirname, 'build', 'test'), absolute: true });
TEST_GROUPS.webpack = [];
// WEBPACK_TESTS.forEach((file) => {
//   TEST_GROUPS.webpack.push({ name: `webpack_${file.replace('.js', '')}`, files: _.flattenDeep([(~file.indexOf('core') ? [] : LOCALIZATION_DEPENCIES), file]) });
// });

// ##############################
// Browserify
// ##############################
TEST_GROUPS.browserify = [];
// _.each(require('./browserify/tests'), (test_info, test_name) => {
//   TEST_GROUPS.browserify.push({
//     name: `browserify_${test_name}`,
//     files: _.flattenDeep([(~test_info.files.indexOf('core') ? [] : LOCALIZATION_DEPENCIES), test_info.output]),
//     build: { destination: test_info.output, options: test_info.options, files: test_info.files },
//   });
// });

// TEST_GROUPS = {browser_globals: TEST_GROUPS.browser_globals.slice(0, 1)};
// TEST_GROUPS = {amd: TEST_GROUPS.amd.slice(0, 1)};
// TEST_GROUPS = {webpack: TEST_GROUPS.webpack.slice(0, 1)};
// TEST_GROUPS = {browserify: TEST_GROUPS.browserify.slice(0, 1)};
// console.log('TEST_GROUPS', JSON.stringify(TEST_GROUPS));

module.exports = TEST_GROUPS;
