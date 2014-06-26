module.exports =
  'test/bundles/build/full-stack-underscore-core.js':
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

  'test/bundles/build/full-stack-underscore.js':
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

  'test/bundles/build/full-stack-lodash-core.js':
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

  'test/bundles/build/full-stack-lodash.js':
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
