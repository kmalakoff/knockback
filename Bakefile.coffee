module.exports =
  publishing:
    _build:
      commands: [
        # knockback dependencies
        'cp -v underscore vendor/underscore.js'
        'cp -v backbone vendor/backbone.js'
        'cp knockout vendor/knockout-3.1.0.js'

        # knockback optional dependencies
        'cp -v lodash vendor/optional/lodash/lodash.js'
        'cp -v backbone-modelref vendor/optional/backbone-modelref/backbone-modelref.js'
        'cp -v backbone-relational vendor/optional/backbone-relational/backbone-relational.js'
        'cp -v backbone-associations vendor/optional/backbone-associations/backbone-associations.js'
        'cp -v supermodel vendor/optional/supermodel/supermodel.js'

        'cp -v backbone-orm vendor/optional/backbone-orm/backbone-orm.js'
        'cp -v moment vendor/optional/backbone-orm/moment.js'
      ]
