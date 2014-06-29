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
  backbone_underscore_latest: ['./vendor/test/jquery-1.11.1.min.js', './vendor/underscore-1.6.0.js', './vendor/backbone-1.1.2.js', './vendor/knockout-3.1.0.js']
  backbone_underscore_legacy: ['./vendor/test/jquery-1.11.1.min.js', './vendor/underscore-1.1.7.js', './vendor/backbone-0.5.1.js', './vendor/knockout-1.2.1.js']
  backbone_lodash_latest: ['./vendor/test/jquery-1.11.1.min.js', './vendor/optional/lodash-0.3.2.js', './vendor/backbone-1.1.2.js', './vendor/knockout-3.1.0.js']
  backbone_lodash_legacy: ['./vendor/test/jquery-1.11.1.min.js', './vendor/optional/lodash-2.4.1.js', './vendor/backbone-0.5.1.js', './vendor/knockout-1.2.1.js']
  parse_latest: ['./vendor/test/jquery-1.11.1.min.js', './vendor/optional/parse-1.2.0.js', './vendor/knockout-1.2.1.js']

LOCALIZATION_DEPENCIES = ['./vendor/test/globalize/globalize.js', './vendor/test/globalize/globalize.culture.en-GB.js', './vendor/test/globalize/globalize.culture.fr-FR.js']
LOCALIZATION = ['./_temp/knockback-examples-localization.js'].concat(LOCALIZATION_DEPENCIES)

MODEL_REF = './vendor/optional/backbone-modelref-0.1.5.js'

ORM =
  backbone_orm: ['./vendor/optional/backbone-orm-0.5.17.js']
  relational: ['./vendor/optional/backbone-relational-0.8.8.js']
  associations: ['./vendor/optional/backbone-relational-0.5.4.js']
  supermodel_legacy: ['./vendor/optional/supermodel-0.0.1.js']
  supermodel: ['./vendor/optional/supermodel-0.0.4.js']

module.exports = TEST_GROUPS = {}

###############################
# Full Library
###############################
TEST_GROUPS.full = []
for test_name, test_files of KNOCKBACK when (test_name.indexOf('full') >= 0 and test_name.indexOf('stack') < 0)
  for dep_name, dep_files of REQUIRED_DEPENDENCIES
    if dep_name.indexOf('backbone') >= 0 # Backbone
      TEST_GROUPS.full.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files, LOCALIZATION, MODEL_REF, './test/knockback/**/*.tests.coffee'])})
    else # Parse
      TEST_GROUPS.full.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files, LOCALIZATION, './test/knockback/**/*.tests.coffee'])})

###############################
# Core Library
###############################
TEST_GROUPS.core = []
for test_name, test_files of KNOCKBACK when (test_name.indexOf('core') >= 0 and test_name.indexOf('stack') < 0)
  TEST_GROUPS.core.push({name: "core_#{test_name}", files: _.flatten([REQUIRED_DEPENDENCIES.backbone_underscore_latest, test_files, './test/knockback/**/*.core.tests.coffee'])})

###############################
# ORM
###############################
ORM_TESTS =
  backbone_orm: [KNOCKBACK.full, './vendor/optional/moment-2.7.0.js', './vendor/optional/backbone-orm-0.5.17.js', './test/ecosystem/**/backbone-orm*.tests.coffee']
  backbone_relational: [KNOCKBACK.full, './vendor/optional/backbone-relational-0.8.8.js', './test/ecosystem/**/backbone-relational*.tests.coffee']
  backbone_associations: [KNOCKBACK.full, './vendor/optional/backbone-associations-0.5.5.js', './test/ecosystem/**/backbone-associations*.tests.coffee']
  supermodel: [KNOCKBACK.full, './vendor/optional/supermodel-0.0.4.js', './test/ecosystem/**/supermodel*.tests.coffee']

TEST_GROUPS.orm = []
for dep_name, dep_files of _.pick(REQUIRED_DEPENDENCIES, 'backbone_underscore_latest')
  TEST_GROUPS.orm.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files])}) for test_name, test_files of ORM_TESTS

###############################
# CommonJS
###############################
COMMONJS_TESTS =
  latest: ['./vendor/test/jquery-1.11.1.min.js', './_temp/commonjs/latest.js', LOCALIZATION_DEPENCIES, MODEL_REF, './test/knockback/**/*.tests.coffee']

TEST_GROUPS.commonjs = []
TEST_GROUPS.commonjs.push({name: "commonjs_#{test_name}", files: _.flatten(test_files)}) for test_name, test_files of COMMONJS_TESTS

###############################
# Stack Libraries - Bundled Dependencies
###############################
STACK_TESTS =
  lodash: ['./vendor/test/jquery-1.11.1.min.js', './_temp/commonjs/full-stack-lodash.js', LOCALIZATION_DEPENCIES, './test/knockback/**/*.tests.coffee']
  underscore: ['./vendor/test/jquery-1.11.1.min.js', './_temp/commonjs/full-stack-underscore.js', LOCALIZATION_DEPENCIES, './test/knockback/**/*.tests.coffee']
  full: ['./vendor/test/jquery-1.11.1.min.js', './knockback-full-stack.js', LOCALIZATION, MODEL_REF, './test/knockback/**/*.tests.coffee']

# Full Stack
TEST_GROUPS.full_stack = []
TEST_GROUPS.full_stack.push({name: "full-stack_#{test_name}", files: _.flatten([test_files, './test/knockback/**/*.tests.coffee'])}) for test_name, test_files of STACK_TESTS

###############################
# AMD
###############################
TEST_GROUPS.amd = []
for test in TEST_GROUPS.full.concat(TEST_GROUPS.core) when (test.name.indexOf('_min') < 0 and test.name.indexOf('legacy_') < 0 and test.name.indexOf('parse_') < 0)
  do (test) ->
    files = []
    files.push({pattern: file}) for file in ['./vendor/test/require-2.1.9.js']
    files.push({pattern: file, included: false}) for file in test.files.slice(0, -1)
    files.push({pattern: file}) for file in ["./_temp/amd/#{test.name}/#{gutil.replaceExtension(path.basename(test.files.slice(-1)[0]), '.js')}"]
    TEST_GROUPS.amd.push({name: "amd_#{test.name}", files: files, original_files: test.files, destination: "_temp/amd/#{test.name}"})

###############################
# Webpack
###############################
WEBPACK_TESTS =
  full: ['./temp/webpack/knockback.tests.js']
  core: ['./temp/webpack/knockback-core.tests.js']

# Full Stack
TEST_GROUPS.webpack = []
TEST_GROUPS.webpack.push({name: "webpack_#{test_name}", files: _.flatten([test_files, './test/knockback/**/*.tests.coffee'])}) for test_name, test_files of STACK_TESTS
