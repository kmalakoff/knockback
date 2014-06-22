module.exports =
  'test/full-stack/build/bundle-underscore-core.js':
    underscore: 'vendor/underscore-1.6.0.js'
    backbone: 'vendor/backbone-1.1.2.js'
    'backbone-modelref': 'backbone-modelref'
    'backbone-relational': 'backbone-relational'
    knockout: 'vendor/knockout-3.1.0.js'
    knockback: 'knockback-core.js'
    _publish:
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'

  'test/full-stack/build/bundle-underscore.js':
    underscore: 'vendor/underscore-1.6.0.js'
    backbone: 'vendor/backbone-1.1.2.js'
    'backbone-modelref': 'backbone-modelref'
    'backbone-relational': 'backbone-relational'
    knockout: 'vendor/knockout-3.1.0.js'
    knockback: 'knockback.js'
    'knockback-examples-localization': 'test/_examples/build/_localization_examples.js'
    _publish:
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'

  'test/full-stack/build/bundle-lodash-core.js':
    lodash: 'vendor/optional/lodash-2.4.1.js'
    backbone: 'vendor/backbone-1.1.2.js'
    'backbone-modelref': 'backbone-modelref'
    'backbone-relational': 'backbone-relational'
    knockout: 'vendor/knockout-3.1.0.js'
    knockback: 'knockback-core.js'
    _alias:
      underscore: 'lodash'
    _publish:
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'

  'test/full-stack/build/bundle-lodash.js':
    lodash: 'vendor/optional/lodash-2.4.1.js'
    backbone: 'vendor/backbone-1.1.2.js'
    'backbone-modelref': 'backbone-modelref'
    'backbone-relational': 'backbone-relational'
    knockout: 'vendor/knockout-3.1.0.js'
    knockback: 'knockback.js'
    'knockback-examples-localization': 'test/_examples/build/_localization_examples.js'
    _alias:
      underscore: 'lodash'
    _publish:
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'