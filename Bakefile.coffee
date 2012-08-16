module.exports =
  library:
    join: 'knockback.js'
    compress: true
    files: [
      'src/knockback_core.coffee'
      'src/knockback_statistics.coffee'
      'src/knockback_utils.coffee'
      'src/knockback_ref_countable.coffee'
      'src/knockback_factory.coffee'
      'src/knockback_store.coffee'
      'src/knockback_collection_observable.coffee'
      'src/knockback_default_wrapper.coffee'
      'src/knockback_formatted_observable.coffee'
      'src/knockback_localized_observable.coffee'
      'src/knockback_observable.coffee'
      'src/knockback_observables.coffee'
      'src/knockback_triggered_observable.coffee'
      'src/knockback_attribute_observable.coffee'
      'src/knockback_view_model.coffee'
    ]
    _build:
      commands: [
        'cp knockback.js packages/npm/knockback.js'
        'cp knockback.min.js packages/npm/knockback.min.js'
        'cp README.md packages/npm/README.md'
        'cp knockback.js packages/nuget/Content/Scripts/knockback.js'
        'cp knockback.min.js packages/nuget/Content/Scripts/knockback.min.js'
      ]

  test_examples:
    join: '_examples.js'
    output: 'test/_examples/build'
    files: [
      'test/_examples/contact.coffee'
      'test/_examples/locale_manager.coffee'
      'test/_examples/localized_observables.coffee'
      'test/_examples/localized_string.coffee'
    ]

  tests:
    _build:
      output: 'build'
      directories: [
        'test/knockback_legacy'
        'test/knockback_utils'
        'test/backbone_modelref'
        'test/backbone_relational'
        'test/knockback_collection_observable'
        'test/knockback_formatted_observable'
        'test/knockback_localized_observable'
        'test/knockback_observable'
        'test/knockback_observables'
        'test/knockback_triggered_observable'
        'test/knockback_view_model'
        'test/knockback_memory_management'
      ]
      commands: [
        'mbundle test/packaging/bundle-config.coffee'
        'mbundle test/lodash/bundle-config.coffee'
      ]
    _test:
      command: 'phantomjs'
      runner: 'phantomjs-qunit-runner.js'
      files: '**/*.html'
      directories: [
        'test/knockback_legacy'
        'test/knockback_utils'
        'test/backbone_modelref'
        'test/backbone_relational'
        'test/knockback_collection_observable'
        'test/knockback_formatted_observable'
        'test/knockback_localized_observable'
        'test/knockback_observable'
        'test/knockback_observables'
        'test/knockback_triggered_observable'
        'test/knockback_view_model'
        'test/knockback_memory_management'
        'test/packaging'
        'test/lodash'
      ]

  _postinstall:
    commands: [
      'cp underscore vendor/underscore-latest.js'
      'cp backbone vendor/backbone-latest.js'
      'cp backbone-modelref vendor/backbone-modelref-latest.js'
      'cp backbone-relational vendor/backbone-relational-latest.js'
      'cp knockout-client/knockout.debug.js vendor/knockout-latest.js'
    ]