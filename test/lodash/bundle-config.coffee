module.exports =
  'test/lodash/build/bundle-lodash-legacy.js':
    lodash: 'vendor/optional/lodash-0.3.2.js'
    backbone: 'backbone'
    'backbone-modelref': 'backbone-modelref'
    knockout: 'vendor/knockout-2.1.0.js'
    knockback: 'knockback.js'
    'knockback-examples-localization': 'test/_examples/build/_localization_examples.js'
    _alias:
      underscore: 'lodash'

  'test/lodash/build/bundle-lodash-latest.js':
    lodash: 'vendor/optional/lodash-0.9.0.js'
    backbone: 'backbone'
    'backbone-modelref': 'backbone-modelref'
    knockout: 'vendor/knockout-2.1.0.js'
    knockback: 'knockback.js'
    'knockback-examples-localization': 'test/_examples/build/_localization_examples.js'
    _alias:
      underscore: 'lodash'
