_ = require 'underscore'

KNOCKBACK =
  full: ['./knockback.js', './lib/knockback-statistics.js']
  full_min: ['./knockback.min.js', './lib/knockback-statistics.js']
  full_stack: ['./knockback-full-stack.js', './lib/knockback-statistics.js']
  core: ['./knockback-core.js', './lib/knockback-statistics.js']
  core_min: ['./knockback-core.min.js', './lib/knockback-statistics.js']
  core_stack: ['./knockback-core-stack.js', './lib/knockback-statistics.js']

DEPENDENCIES =
  latest: ['./vendor/test/jquery-1.11.1.min.js', './vendor/underscore-1.6.0.js', './vendor/backbone-1.1.2.js', './vendor/knockout-3.1.0.js']
  legacy: ['./vendor/test/jquery-1.11.1.min.js', './vendor/underscore-1.1.7.js', './vendor/backbone-0.5.1.js', './vendor/knockout-1.2.1.js']

LOCALIZATION = [
  './test/_examples/build/_localization_examples.js'
  './vendor/test/globalize/globalize.js'
  './vendor/test/globalize/globalize.culture.en-GB.js'
  './vendor/test/globalize/globalize.culture.fr-FR.js'
]

MODEL_REF = './vendor/optional/backbone-modelref-0.1.5.js'

ECOSYSTEM =
  backbone_orm: ['./vendor/optional/backbone-orm-0.5.16.js']
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


module.exports = FILES = []

KNOCKBACK_TESTS =
  knockback_full: [KNOCKBACK.full, LOCALIZATION, MODEL_REF, './test/knockback/**/*.tests.coffee']
  knockback_full_min: [KNOCKBACK.full_min, LOCALIZATION, MODEL_REF, './test/knockback/**/*.tests.coffee']
KNOCKBACK_TESTS["knockback_core_#{core_name}"] = [DEPENDENCIES.latest, KNOCKBACK.core, core_files] for core_name, core_files of CORE
KNOCKBACK_TESTS["knockback_core_min_#{core_name}"] = [DEPENDENCIES.latest, KNOCKBACK.core_min, core_files] for core_name, core_files of CORE

for dep_name, dep_files of DEPENDENCIES
  FILES.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files])}) for test_name, test_files of KNOCKBACK_TESTS

ECOSYSTEM_TESTS =
  backbone_orm: [KNOCKBACK.full, './vendor/optional/moment-2.7.0.js', './vendor/optional/backbone-orm-0.5.16.js', './test/ecosystem/**/backbone-orm*.tests.coffee']
  backbone_relational: [KNOCKBACK.full, './vendor/optional/backbone-relational-0.8.8.js', './test/ecosystem/**/backbone-relational*.tests.coffee']
  backbone_associations: [KNOCKBACK.full, './vendor/optional/backbone-associations-0.5.5.js', './test/ecosystem/**/backbone-associations*.tests.coffee']
  supermodel: [KNOCKBACK.full, './vendor/optional/supermodel-0.0.4.js', './test/ecosystem/**/supermodel*.tests.coffee']

for dep_name, dep_files of _.pick(DEPENDENCIES, 'latest')
  FILES.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files])}) for test_name, test_files of ECOSYSTEM_TESTS
