_ = require 'underscore'

FILES =
  localization: [
    './test_karma/_examples/build/_localization_examples.js'
    './vendor/test/globalize/globalize.js'
    './vendor/test/globalize/globalize.culture.en-GB.js'
    './vendor/test/globalize/globalize.culture.fr-FR.js'
  ]

  knockback: [
    './knockback.js'
    './lib/knockback-statistics.js'
  ]

  knockback_core: [
    './knockback-core.js'
    './lib/knockback-statistics.js'
  ]

  dependencies_latest: [
    './vendor/test/jquery-1.7.2.js'
    './vendor/underscore-1.6.0.js'
    './vendor/backbone-1.1.2.js'
    './vendor/knockout-3.1.0.js'
  ]

  dependencies_legacy1: [
    './vendor/test/jquery-1.7.2.js'
    './vendor/underscore-1.6.0.js'
    './vendor/backbone-0.9.10.js'
    './vendor/knockout-3.1.0.js'
  ]

  dependencies_legacy2: [
    './vendor/test/jquery-1.7.2.js'
    './vendor/underscore-1.6.0.js'
    './vendor/backbone-0.9.2.js'
    './vendor/knockout-3.1.0.js'
  ]

  dependencies: [
    './vendor/optional/backbone-modelref-0.1.5.js'
    './vendor/optional/backbone-relational-0.8.8.js'
  ]

SETUPS =
  LATEST: _.flatten([FILES.dependencies_latest, FILES.knockback, FILES.localization, FILES.dependencies])

module.exports = [SETUPS.LATEST.concat('./test_karma/knockback/**/*.coffee')]
