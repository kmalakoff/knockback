module.exports =
  library:
    join: 'knockback.js'
    compress: true
    files: [
      'src/knockback_core.coffee'
      'src/knockback_utils.coffee'
      'src/knockback_factory.coffee'
      'src/knockback_store.coffee'
      'src/knockback_model_watcher.coffee'
      'src/knockback_collection_observable.coffee'
      'src/knockback_default_wrapper.coffee'
      'src/knockback_formatted_observable.coffee'
      'src/knockback_localized_observable.coffee'
      'src/knockback_observable.coffee'
      'src/knockback_triggered_observable.coffee'
      'src/knockback_view_model.coffee'
    ]
    _build:
      commands: [
        # knockback dependencies
        'cp -v underscore vendor/underscore.js'
        'cp -v underscore/underscore-min.js vendor/underscore.min.js'
        'cp -v backbone vendor/backbone.js'
        'cp -v backbone/backbone-min.js vendor/backbone.min.js'
        'cp -v knockout-client/knockout.js vendor/knockout.js'
        'cp -v knockout-client/knockout.debug.js vendor/knockout.min.js'

        # knockback optional dependencies
        'cp -v lodash vendor/optional/lodash.js'
        'cp -v lodash/lodash.min.js vendor/optional/lodash.min.js'
        'cp -v backbone-modelref vendor/optional/backbone-modelref.js'
        'cp -v backbone-modelref/backbone-modelref.min.js vendor/optional/backbone-modelref.min.js'
        'cp -v backbone-relational vendor/optional/backbone-relational.js'
        'cp -v backbone-relational/backbone-relational.min.js vendor/optional/backbone-relational.min.js'

        # reduced-size stack
        'uglifyjs -o vendor/underscore-1.3.3-kb.min.js vendor/underscore-1.3.3-kb.js'
        'uglifyjs -o vendor/backbone-0.9.2-kb.min.js vendor/backbone-0.9.2-kb.js'
        'uglifyjs -o vendor/knockout-2.1.0-kb.min.js vendor/knockout-2.1.0-kb.js'
        'uglifyjs -o vendor/optional/lodash-0.6.1-kb.min.js vendor/optional/lodash-0.6.1-kb.js'
        'cat -o knockback-minimal-stack.js vendor/underscore-1.3.3-kb.js vendor/backbone-0.9.2-kb.js vendor/knockout-2.1.0-kb.js knockback.js'
        'cat -o knockback-minimal-stack.min.js vendor/underscore-1.3.3-kb.min.js vendor/backbone-0.9.2-kb.min.js vendor/knockout-2.1.0-kb.min.js knockback.min.js'

        # npm
        'cp knockback.js packages/npm/knockback.js'
        'cp knockback.min.js packages/npm/knockback.min.js'
        'cp knockback.js packages/npm/knockback-minimal-stack.js'
        'cp knockback.min.js packages/npm/knockback-minimal-stack.min.js'
        'cp README.md packages/npm/README.md'
        'cp vendor/underscore-1.3.3-kb.js packages/npm/vendor/underscore-1.3.3-kb.js'
        'cp vendor/underscore-1.3.3-kb.min.js packages/npm/vendor/underscore-1.3.3-kb.min.js'
        'cp vendor/backbone-0.9.2-kb.js packages/npm/vendor/backbone-0.9.2-kb.js'
        'cp vendor/backbone-0.9.2-kb.min.js packages/npm/vendor/backbone-0.9.2-kb.min.js'
        'cp vendor/knockout-2.1.0-kb.js packages/npm/vendor/knockout-2.1.0-kb.js'
        'cp vendor/knockout-2.1.0-kb.min.js packages/npm/vendor/knockout-2.1.0-kb.min.js'
        'cp vendor/optional/lodash-0.6.1-kb.js packages/npm/vendor/optional/lodash-0.6.1-kb.js'
        'cp vendor/optional/lodash-0.6.1-kb.min.js packages/npm/vendor/optional/lodash-0.6.1-kb.min.js'

        # nuget
        'cp knockback.js packages/nuget/Content/Scripts/knockback.js'
        'cp knockback.min.js packages/nuget/Content/Scripts/knockback.min.js'
        'cp knockback.js packages/nuget/Content/Scripts/knockback-minimal-stack.js'
        'cp knockback.min.js packages/nuget/Content/Scripts/knockback-minimal-stack.min.js'
        'cp vendor/underscore-1.3.3-kb.js packages/nuget/Content/Scripts/vendor/underscore-1.3.3-kb.js'
        'cp vendor/underscore-1.3.3-kb.min.js packages/nuget/Content/Scripts/vendor/underscore-1.3.3-kb.min.js'
        'cp vendor/backbone-0.9.2-kb.js packages/nuget/Content/Scripts/vendor/backbone-0.9.2-kb.js'
        'cp vendor/backbone-0.9.2-kb.min.js packages/nuget/Content/Scripts/vendor/backbone-0.9.2-kb.min.js'
        'cp vendor/knockout-2.1.0-kb.js packages/nuget/Content/Scripts/vendor/knockout-2.1.0-kb.js'
        'cp vendor/knockout-2.1.0-kb.min.js packages/nuget/Content/Scripts/vendor/knockout-2.1.0-kb.min.js'
        'cp vendor/optional/lodash-0.6.1-kb.js packages/nuget/Content/Scripts/vendor/optional/lodash-0.6.1-kb.js'
        'cp vendor/optional/lodash-0.6.1-kb.min.js packages/nuget/Content/Scripts/vendor/optional/lodash-0.6.1-kb.min.js'
      ]

  statistics:
    output: 'lib'
    files: 'src/lib/knockback-statistics.coffee'
    _build:
      commands: [
        'cp lib/knockback-statistics.js packages/npm/lib/knockback-statistics.js'
        'cp lib/knockback-statistics.js packages/nuget/Content/Scripts/lib/knockback-statistics.js'
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
        'test/knockback_triggered_observable'
        'test/knockback_view_model'
        'test/knockback_memory_management'
      ]
      commands: [
        'mbundle test/packaging/bundle-config.coffee'
        'mbundle test/lodash/bundle-config.coffee'
        'mbundle test/minimal-stack/bundle-config.coffee'
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
        'test/knockback_triggered_observable'
        'test/knockback_view_model'
        'test/knockback_memory_management'
        'test/minimal-stack'
        'test/packaging'
        'test/lodash'
      ]