module.exports =
  'test/bundles/build/lodash-legacy.js':
    lodash: 'vendor/optional/lodash-0.3.2.js'
    backbone: 'vendor/backbone-0.5.1.js'
    'backbone-modelref': 'backbone-modelref'
    knockout: 'vendor/knockout-3.1.0.js'
    knockback: 'knockback.js'
    'knockback-examples-localization': 'test/_examples/build/_localization_examples.js'
    _alias:
      underscore: 'lodash'

  'test/bundles/build/lodash-latest.js':
    lodash: 'vendor/optional/lodash-2.4.1.js'
    backbone: 'backbone'
    'backbone-modelref': 'backbone-modelref'
    knockout: 'vendor/knockout-3.1.0.js'
    knockback: 'knockback.js'
    'knockback-examples-localization': 'test/_examples/build/_localization_examples.js'
    _alias:
      underscore: 'lodash'
