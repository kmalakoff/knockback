_ = require 'underscore'

KNOCKBACK =
  full: ['./knockback.js', './lib/knockback-statistics.js']
  full_min: ['./knockback.min.js', './lib/knockback-statistics.js']
  full_stack: ['./knockback-full-stack.js', './lib/knockback-statistics.js']
  core: ['./knockback-core.js', './lib/knockback-statistics.js']
  core_min: ['./knockback-core.min.js', './lib/knockback-statistics.js']
  core_stack: ['./knockback-core-stack.js', './lib/knockback-statistics.js']

REQUIRED_DEPENDENCIES =
  backbone_underscore_latest: ['./vendor/test/jquery-1.11.1.min.js', './vendor/underscore-1.6.0.js', './vendor/backbone-1.1.2.js', './vendor/knockout-3.1.0.js']
  backbone_underscore_legacy: ['./vendor/test/jquery-1.11.1.min.js', './vendor/underscore-1.1.7.js', './vendor/backbone-0.5.1.js', './vendor/knockout-1.2.1.js']
  backbone_lodash_latest: ['./vendor/test/jquery-1.11.1.min.js', './vendor/optional/lodash-0.3.2.js', './vendor/backbone-1.1.2.js', './vendor/knockout-3.1.0.js']
  backbone_lodash_legacy: ['./vendor/test/jquery-1.11.1.min.js', './vendor/optional/lodash-2.4.1.js', './vendor/backbone-0.5.1.js', './vendor/knockout-1.2.1.js']
  parse_latest: ['./vendor/test/jquery-1.11.1.min.js', './vendor/optional/parse-1.2.0.js', './vendor/knockout-1.2.1.js']

LOCALIZATION = ['./test/_examples/build/_localization_examples.js', './vendor/test/globalize/globalize.js', './vendor/test/globalize/globalize.culture.en-GB.js', './vendor/test/globalize/globalize.culture.fr-FR.js']

MODEL_REF = './vendor/optional/backbone-modelref-0.1.5.js'

ORM =
  backbone_orm: ['./vendor/optional/backbone-orm-0.5.17.js']
  relational: ['./vendor/optional/backbone-relational-0.8.8.js']
  associations: ['./vendor/optional/backbone-relational-0.5.4.js']
  supermodel_legacy: ['./vendor/optional/supermodel-0.0.1.js']
  supermodel: ['./vendor/optional/supermodel-0.0.4.js']

CORE =
  simple: ['./test/knockback/core.tests.coffee', './test/knockback/collection-observable.tests.coffee', './test/knockback/inject.tests.coffee', './test/knockback/memory-management.tests.coffee', './test/knockback/observable.tests.coffee', './test/knockback/memory-management.tests.coffee', './test/knockback/utils.tests.coffee', './test/knockback/view-model.tests.coffee']
  defaults: ['./lib/knockback-localization.js', LOCALIZATION, MODEL_REF, './lib/knockback-defaults.js', './test/knockback/defaults.tests.coffee']
  formatting: ['./lib/knockback-formatting.js', './test/knockback/formatting.tests.coffee']
  localization: ['./lib/knockback-localization.js', LOCALIZATION, './test/knockback/localization.tests.coffee']
  triggering: ['./lib/knockback-triggering.js', './test/knockback/triggering.tests.coffee']
  validation: ['./lib/knockback-validation.js', './test/knockback/validation.tests.coffee']


module.exports = {}

###############################
# Full Library
###############################
full = module.exports.full = []
for test_name, test_files of KNOCKBACK when (test_name.indexOf('full') >= 0 and test_name.indexOf('stack') < 0)
  for dep_name, dep_files of REQUIRED_DEPENDENCIES
    if dep_name.indexOf('backbone') >= 0 # Backbone
      full.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files, LOCALIZATION, MODEL_REF, './test/knockback/**/*.tests.coffee'])})
    else # Parse
      full.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files, LOCALIZATION, './test/knockback/**/*.tests.coffee'])})

###############################
# Core Library
###############################
core = module.exports.core = []
for test_name, test_files of KNOCKBACK when (test_name.indexOf('core') >= 0 and test_name.indexOf('stack') < 0)
  for core_name, core_files of CORE
    core.push({name: "#{core_name}_#{test_name}", files: _.flatten([REQUIRED_DEPENDENCIES.backbone_underscore_latest, test_files, core_files])})

###############################
# ORM
###############################
ORM_TESTS =
  backbone_orm: [KNOCKBACK.full, './vendor/optional/moment-2.7.0.js', './vendor/optional/backbone-orm-0.5.17.js', './test/ecosystem/**/backbone-orm*.tests.coffee']
  backbone_relational: [KNOCKBACK.full, './vendor/optional/backbone-relational-0.8.8.js', './test/ecosystem/**/backbone-relational*.tests.coffee']
  backbone_associations: [KNOCKBACK.full, './vendor/optional/backbone-associations-0.5.5.js', './test/ecosystem/**/backbone-associations*.tests.coffee']
  supermodel: [KNOCKBACK.full, './vendor/optional/supermodel-0.0.4.js', './test/ecosystem/**/supermodel*.tests.coffee']

orm = module.exports.orm = []
for dep_name, dep_files of _.pick(REQUIRED_DEPENDENCIES, 'backbone_underscore_latest')
  orm.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files])}) for test_name, test_files of ORM_TESTS

###############################
# CommonJS
###############################
COMMONJS_TESTS =
  latest: ['./vendor/test/jquery-1.11.1.min.js', './test/bundles/build/commonjs-latest.js', './lib/knockback-statistics.js', LOCALIZATION, MODEL_REF, './test/knockback/**/*.tests.coffee']

commonjs = module.exports.commonjs = []
commonjs.push({name: "commonjs_#{test_name}", files: _.flatten(test_files)}) for test_name, test_files of COMMONJS_TESTS

###############################
# Stack Libraries - Bundled Dependencies
###############################
STACK_TESTS =
  lodash: ['./vendor/test/jquery-1.11.1.min.js', './test/bundles/build/full-stack-lodash.js', './lib/knockback-statistics.js', LOCALIZATION, MODEL_REF, './test/knockback/**/*.tests.coffee']
  underscore: ['./vendor/test/jquery-1.11.1.min.js', './test/bundles/build/full-stack-underscore.js', './lib/knockback-statistics.js', LOCALIZATION, MODEL_REF, './test/knockback/**/*.tests.coffee']
  full: ['./vendor/test/jquery-1.11.1.min.js', './knockback-full-stack.js', './lib/knockback-statistics.js', LOCALIZATION, MODEL_REF, './test/knockback/**/*.tests.coffee']

# Full Stack
full_stack = module.exports.full_stack = []
full_stack.push({name: "full-stack_#{test_name}", files: _.flatten([test_files, './test/knockback/**/*.tests.coffee'])}) for test_name, test_files of STACK_TESTS

# Core Stack
core_stack = module.exports.core_stack = []
for core_name, core_files of CORE
  core_stack.push({name: "core-stack_#{test_name}_#{core_name}", files: _.flatten([test_files, core_files])}) for test_name, test_files of STACK_TESTS
