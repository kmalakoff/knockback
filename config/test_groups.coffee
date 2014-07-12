fs = require 'fs'
path = require 'path'
_ = require 'underscore'
gutil = require 'gulp-util'

KNOCKBACK =
  full: ['./knockback.js']
  full_min: ['./knockback.min.js']
  full_stack: ['./knockback-full-stack.js']
  core: ['./knockback-core.js']
  core_min: ['./knockback-core.min.js']
  core_stack: ['./knockback-core-stack.js']

REQUIRED_DEPENDENCIES =
  backbone_underscore_latest: ['./vendor/optional/jquery-2.1.1.js', './vendor/underscore-1.6.0.js', './vendor/backbone-1.1.2.js', './vendor/knockout-3.1.0.js']
  backbone_underscore_legacy: ['./vendor/optional/jquery-2.1.1.js', './vendor/underscore-1.1.7.js', './vendor/backbone-0.5.1.js', './vendor/knockout-1.2.1.js']
  backbone_lodash_latest: ['./vendor/optional/jquery-2.1.1.js', './vendor/optional/lodash-0.3.2.js', './vendor/backbone-1.1.2.js', './vendor/knockout-3.1.0.js']
  backbone_lodash_legacy: ['./vendor/optional/jquery-2.1.1.js', './vendor/optional/lodash-2.4.1.js', './vendor/backbone-0.5.1.js', './vendor/knockout-1.2.1.js']
  parse_latest: ['./vendor/optional/jquery-2.1.1.js', './vendor/optional/parse-1.2.0.js', './vendor/knockout-1.2.1.js']

LOCALIZATION = ['./test/lib/knockback-examples-localization.js']
MODEL_REF = './vendor/optional/backbone-modelref-0.1.5.js'

FILES = require './files'

module.exports = TEST_GROUPS = {}

###############################
# Full Library
###############################
TEST_GROUPS.full = []
for test_name, test_files of KNOCKBACK when (test_name.indexOf('full') >= 0 and test_name.indexOf('stack') < 0)
  for dep_name, dep_files of REQUIRED_DEPENDENCIES
    if dep_name.indexOf('backbone') >= 0 # Backbone
      TEST_GROUPS.full.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files, LOCALIZATION, MODEL_REF, './test/spec/core/**/*.tests.coffee', './test/spec/plugins/**/*.tests.coffee'])})
    else # Parse
      TEST_GROUPS.full.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files, LOCALIZATION, './test/spec/core/**/*.tests.coffee', './test/spec/plugins/**/*.tests.coffee'])})

###############################
# Core Library
###############################
TEST_GROUPS.core = []
for test_name, test_files of KNOCKBACK when (test_name.indexOf('core') >= 0 and test_name.indexOf('stack') < 0)
  TEST_GROUPS.core.push({name: "core_#{test_name}", files: _.flatten([REQUIRED_DEPENDENCIES.backbone_underscore_latest, test_files, './test/spec/core/**/*.tests.coffee'])})

###############################
# ORM
###############################
ORM_TESTS =
  backbone_orm: [KNOCKBACK.full, './vendor/optional/moment-2.7.0.js', './vendor/optional/backbone-orm-0.6.0.js', './test/spec/ecosystem/**/backbone-orm*.tests.coffee']
  backbone_relational: [KNOCKBACK.full, './vendor/optional/backbone-relational-0.8.8.js', './test/spec/ecosystem/**/backbone-relational*.tests.coffee']
  backbone_associations: [KNOCKBACK.full, './vendor/optional/backbone-associations-0.5.5.js', './test/spec/ecosystem/**/backbone-associations*.tests.coffee']
  supermodel: [KNOCKBACK.full, './vendor/optional/supermodel-0.0.4.js', './test/spec/ecosystem/**/supermodel*.tests.coffee']

TEST_GROUPS.orm = []
for dep_name, dep_files of _.pick(REQUIRED_DEPENDENCIES, 'backbone_underscore_latest')
  TEST_GROUPS.orm.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files])}) for test_name, test_files of ORM_TESTS

###############################
# AMD
###############################
AMD_OPTIONS = require './amd/gulp-options'
TEST_GROUPS.amd = []
for test in TEST_GROUPS.full.concat(TEST_GROUPS.core) when (test.name.indexOf('_min') < 0 and test.name.indexOf('legacy_') < 0 and test.name.indexOf('parse_') < 0)
  test_files = ['./node_modules/chai/chai.js'].concat(test.files)
  files = []
  files.push({pattern: file}) for file in ['./vendor/optional/requirejs-2.1.14.js']
  files.push({pattern: file, included: false}) for file in test_files.slice(0, -1)
  files.push({pattern: file}) for file in ["./_temp/amd/#{test.name}/#{gutil.replaceExtension(path.basename(test_files.slice(-1)[0]), '.js')}"]
  TEST_GROUPS.amd.push({name: "amd_#{test.name}", files: files, build: {files: test_files, destination: "_temp/amd/#{test.name}", options: _.extend({files: test_files.slice(0, -1)}, AMD_OPTIONS)}})

###############################
# Webpack
###############################
TEST_GROUPS.webpack = []
for file in FILES.tests_webpack
  TEST_GROUPS.webpack.push({name: "webpack_#{file.replace('.js', '')}", files: _.flatten(['./vendor/optional/jquery-2.1.1.js', (if file.indexOf('core') >= 0 then [] else LOCALIZATION), file])})

###############################
# Browserify
###############################
TEST_GROUPS.browserify = []
for test_name, test_info of require('./browserify/tests')
  TEST_GROUPS.browserify.push({name: "browserify_#{test_name}", files: _.flatten(['./vendor/optional/jquery-2.1.1.js', (if test_info.output.indexOf('core') >= 0 then [] else LOCALIZATION), test_info.output]), build: {destination: test_info.output, options: test_info.options, files: test_info.files}})
