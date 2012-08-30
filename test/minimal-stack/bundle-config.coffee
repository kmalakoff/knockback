module.exports =
  'test/minimal-stack/build/bundle-underscore.js':
    underscore: 'vendor/underscore-1.3.3-kb.min.js'
    backbone: 'vendor/backbone-0.9.2-kb.min.js'
    'backbone-modelref': 'backbone-modelref'
    'backbone-relational': 'backbone-relational'
    knockout: 'vendor/knockout-2.1.0-kb.min.js'
    knockback: 'knockback.js'
    'knockback-examples': 'test/_examples/build/_examples.js'
    _publish:
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'

  'test/minimal-stack/build/bundle-lodash.js':
    lodash: 'vendor/optional/lodash-0.6.1-kb.min.js'
    backbone: 'vendor/backbone-0.9.2-kb.min.js'
    'backbone-modelref': 'backbone-modelref'
    'backbone-relational': 'backbone-relational'
    knockout: 'vendor/knockout-2.1.0-kb.min.js'
    knockback: 'knockback.js'
    'knockback-examples': 'test/_examples/build/_examples.js'
    _alias:
      underscore: 'lodash'
    _publish:
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'

  'test/minimal-stack/build/bundle-minimal-stack.js':
    'knockback-minimal-stack': 'knockback-minimal-stack.min.js'
    'backbone-modelref': 'backbone-modelref'
    'backbone-relational': 'backbone-relational'
    'knockback-examples': 'test/_examples/build/_examples.js'
    _load: 'knockback-minimal-stack'
    _publish:
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'
