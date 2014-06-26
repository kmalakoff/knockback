_ = require 'underscore'

KNOCKBACK =
  full: ['./knockback.js', './lib/knockback-statistics.js']
  full_min: ['./knockback.min.js', './lib/knockback-statistics.js']
  full_stack: ['./knockback-full-stack.js', './lib/knockback-statistics.js']
  core: ['./knockback-core.js', './lib/knockback-statistics.js']
  core_min: ['./knockback-core.min.js', './lib/knockback-statistics.js']
  core_stack: ['./knockback-core-stack.js', './lib/knockback-statistics.js']

DEPENDENCIES =
  latest: ['./vendor/test/jquery-1.7.2.js', './vendor/underscore-1.6.0.js', './vendor/backbone-1.1.2.js', './vendor/knockout-3.1.0.js']
  legacy: ['./vendor/test/jquery-1.7.2.js', './vendor/underscore-1.1.7.js', './vendor/backbone-0.5.1.js', './vendor/knockout-1.2.1.js']
  legacy_bb1: ['./vendor/test/jquery-1.7.2.js', './vendor/underscore-1.6.0.js', './vendor/backbone-0.9.2.js', './vendor/knockout-3.1.0.js']
  legacy_bb2: ['./vendor/test/jquery-1.7.2.js', './vendor/underscore-1.6.0.js', './vendor/backbone-0.9.10.js', './vendor/knockout-3.1.0.js']

LOCALIZATION = [
  './test_karma/_examples/build/_localization_examples.js'
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
  simple: ['./test_karma/knockback/core.tests.coffee', './test_karma/knockback/collection-observable.tests.coffee', './test_karma/knockback/inject.tests.coffee', './test_karma/knockback/memory-management.tests.coffee', './test_karma/knockback/observable.tests.coffee', './test_karma/knockback/memory-management.tests.coffee', './test_karma/knockback/utils.tests.coffee', './test_karma/knockback/view-model.tests.coffee']
  defaults: ['./lib/knockback-localization.js', LOCALIZATION, MODEL_REF, './lib/knockback-defaults.js', './test_karma/knockback/defaults.tests.coffee']
  formatting: ['./lib/knockback-formatting.js', './test_karma/knockback/formatting.tests.coffee']
  localization: ['./lib/knockback-localization.js', LOCALIZATION, './test_karma/knockback/localization.tests.coffee']
  triggering: ['./lib/knockback-triggering.js', './test_karma/knockback/triggering.tests.coffee']
  validation: ['./lib/knockback-validation.js', './test_karma/knockback/validation.tests.coffee']

TESTS =
  knockback_full: [KNOCKBACK.full, LOCALIZATION, MODEL_REF, './test_karma/knockback/**/*tests.coffee']
  knockback_full_min: [KNOCKBACK.full_min, LOCALIZATION, MODEL_REF, './test_karma/knockback/**/*tests.coffee']
TESTS["knockback_core_#{core_name}"] = [DEPENDENCIES.latest, KNOCKBACK.core, core_files] for core_name, core_files of CORE
TESTS["knockback_core_min_#{core_name}"] = [DEPENDENCIES.latest, KNOCKBACK.core_min, core_files] for core_name, core_files of CORE

module.exports = FILES = []
for dep_name, dep_files of DEPENDENCIES
  FILES.push({name: "#{dep_name}_#{test_name}", files: _.flatten([dep_files, test_files])}) for test_name, test_files of TESTS
