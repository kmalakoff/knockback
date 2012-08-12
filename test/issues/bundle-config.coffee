module.exports =
  'client-bundle.js':
    underscore: 'underscore'
    jquery: 'jquery'
    backbone: 'backbone'
    'backbone-relational': 'backbone-relational'
    knockout: 'knockout-client/knockout.debug.js'
    knockback: '../../knockback.js'

    # unpack some globals for the application
    _publish:
      _: 'underscore'
      Backbone: 'backbone'
      ko: 'knockout'
      kb: 'knockback'
    _load: [
      'backbone-relational'
    ]