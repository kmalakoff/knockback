module.exports =
  library:
    join: 'knockback.js'
    wrapper: 'src/module-loader-full.js'
    compress: true
    files: [
      'src/knockback-core/knockback-core.coffee'
      'src/knockback-core/knockback-utils.coffee'
      'src/knockback-core/knockback-factory.coffee'
      'src/knockback-core/knockback-store.coffee'
      'src/knockback-core/knockback-event-watcher.coffee'
      'src/knockback-core/knockback-observable.coffee'
      'src/knockback-core/knockback-view-model.coffee'
      'src/knockback-core/knockback-collection-observable.coffee'
      'src/knockback-core/knockback-inject.coffee'
      'src/knockback-defaults/knockback-default-observable.coffee'
      'src/knockback-defaults/knockback-extensions.coffee'
      'src/knockback-formatting/knockback-formatted-observable.coffee'
      'src/knockback-localization/knockback-localized-observable.coffee'
      'src/knockback-localization/knockback-extensions.coffee'
      'src/knockback-triggering/knockback-triggered-observable.coffee'
      'src/knockback-validation/knockback-validation.coffee'
      'src/knockback-validation/knockback-validators.coffee'
    ]

  knockback_core:
    join: 'knockback-core.js'
    wrapper: 'src/knockback-core/module-loader.js'
    compress: true
    files: [
      'src/knockback-core/knockback-core.coffee'
      'src/knockback-core/knockback-utils.coffee'
      'src/knockback-core/knockback-factory.coffee'
      'src/knockback-core/knockback-store.coffee'
      'src/knockback-core/knockback-event-watcher.coffee'
      'src/knockback-core/knockback-observable.coffee'
      'src/knockback-core/knockback-view-model.coffee'
      'src/knockback-core/knockback-collection-observable.coffee'
      'src/knockback-core/knockback-inject.coffee'
    ]

  knockback_defaults:
    join: 'knockback-defaults.js'
    wrapper: 'src/knockback-defaults/module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/knockback-defaults/knockback-default-observable.coffee'
      'src/knockback-defaults/knockback-extensions.coffee'
    ]

  knockback_formatting:
    join: 'knockback-formatting.js'
    wrapper: 'src/knockback-formatting/module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/knockback-formatting/knockback-formatted-observable.coffee'
    ]

  knockback_localization:
    join: 'knockback-localization.js'
    wrapper: 'src/knockback-localization/module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/knockback-localization/knockback-extensions.coffee'
      'src/knockback-localization/knockback-localized-observable.coffee'
    ]

  knockback_triggering:
    join: 'knockback-triggering.js'
    wrapper: 'src/knockback-triggering/module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/knockback-triggering/knockback-triggered-observable.coffee'
    ]

  knockback_validation:
    join: 'knockback-validation.js'
    wrapper: 'src/knockback-validation/module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/knockback-validation/knockback-validation.coffee'
      'src/knockback-validation/knockback-validators.coffee'
    ]

  knockback_statistics:
    join: 'knockback-statistics.js'
    wrapper: 'src/knockback-statistics/module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/knockback-statistics/knockback-statistics.coffee'
    ]

  test_localization_examples:
    join: '_localization_examples.js'
    wrapper: 'test/_examples/module-loader.js'
    output: 'test/_examples/build'
    files: [
      'test/_examples/component-imports.coffee'
      'test/_examples/locale_manager.coffee'
      'test/_examples/localized_observables.coffee'
      'test/_examples/localized_string.coffee'
    ]

  publishing:
    _build:
      commands: [
        # create docs
        'codo src'

        # knockback dependencies
        'cp -v underscore vendor/underscore.js'
        'cp -v underscore/underscore-min.js vendor/underscore.min.js'
        'cp -v backbone vendor/backbone.js'
        'cp -v backbone/backbone-min.js vendor/backbone.min.js'
        'cp knockout/build/output/knockout-latest.debug.js vendor/knockout-2.2.1.js'
        'cp knockout/build/output/knockout-latest.js vendor/knockout-2.2.1.min.js'

        # knockback optional dependencies
        'cp -v lodash vendor/optional/lodash.js'
        'uglifyjs -o vendor/optional/lodash-1.1.1.min.js vendor/optional/lodash-1.1.1.js'
#        'cp -v lodash/lodash.min.js vendor/optional/lodash.min.js' # packaged lodash.min.js doesn't concatenate properly
        'cp -v backbone-modelref vendor/optional/backbone-modelref.js'
        'cp -v backbone-modelref/backbone-modelref.min.js vendor/optional/backbone-modelref.min.js'
        'cp -v backbone-relational vendor/optional/backbone-relational.js'
        'cp -v backbone-relational/backbone-relational.min.js vendor/optional/backbone-relational.min.js'

        # knockback test dependencies
        # 'cp -v jquery.js vendor/test/jquery.js'
        # 'cp -v jqunitjs/qunit/qunit.js vendor/test/qunit.js'
        # 'cp -v jqunitjs/qunit/qunit.css vendor/test/qunit.css'

        # full and core stack
        'cat src/license-header-full-stack.js vendor/underscore-1.4.4.js vendor/backbone-1.0.0.js vendor/knockout-2.2.1.js knockback.js > knockback-full-stack.js'
        'cat src/license-header-full-stack.js vendor/underscore-1.4.4.min.js vendor/backbone-1.0.0.min.js vendor/knockout-2.2.1.min.js knockback.min.js > knockback-full-stack.min.js'
        'cat src/license-header-core-stack.js vendor/underscore-1.4.4.js vendor/backbone-1.0.0.js vendor/knockout-2.2.1.js knockback-core.js > knockback-core-stack.js'
        'cat src/license-header-core-stack.js vendor/underscore-1.4.4.min.js vendor/backbone-1.0.0.min.js vendor/knockout-2.2.1.min.js knockback-core.min.js > knockback-core-stack.min.js'

        # npm
        'cp README.md packages/npm/README.md'
        'cp knockback.js packages/npm/knockback.js'
        'cp knockback.min.js packages/npm/knockback.min.js'
        'cp knockback-full-stack.js packages/npm/knockback-full-stack.js'
        'cp knockback-full-stack.min.js packages/npm/knockback-full-stack.min.js'

        'cp knockback-core.js packages/npm/knockback-core.js'
        'cp knockback-core.min.js packages/npm/knockback-core.min.js'
        'cp knockback-core-stack.js packages/npm/knockback-core-stack.js'
        'cp knockback-core-stack.min.js packages/npm/knockback-core-stack.min.js'

        # npm: components
        'cp lib/knockback-defaults.js packages/npm/lib/knockback-defaults.js'
        'cp lib/knockback-defaults.min.js packages/npm/lib/knockback-defaults.min.js'
        'cp lib/knockback-formatting.js packages/npm/lib/knockback-formatting.js'
        'cp lib/knockback-formatting.min.js packages/npm/lib/knockback-formatting.min.js'
        'cp lib/knockback-localization.js packages/npm/lib/knockback-localization.js'
        'cp lib/knockback-localization.min.js packages/npm/lib/knockback-localization.min.js'
        'cp lib/knockback-triggering.js packages/npm/lib/knockback-triggering.js'
        'cp lib/knockback-triggering.min.js packages/npm/lib/knockback-triggering.min.js'
        'cp lib/knockback-validation.js packages/npm/lib/knockback-validation.js'
        'cp lib/knockback-validation.min.js packages/npm/lib/knockback-validation.min.js'
        'cp lib/knockback-statistics.js packages/npm/lib/knockback-statistics.js'
        'cp lib/knockback-statistics.min.js packages/npm/lib/knockback-statistics.min.js'

        # nuget
        'cp knockback.js packages/nuget/Content/Scripts/knockback.js'
        'cp knockback.min.js packages/nuget/Content/Scripts/knockback.min.js'
        'cp knockback-full-stack.js packages/nuget/Content/Scripts/knockback-full-stack.js'
        'cp knockback-full-stack.min.js packages/nuget/Content/Scripts/knockback-full-stack.min.js'

        'cp knockback-core.js packages/nuget/Content/Scripts/knockback-core.js'
        'cp knockback-core.min.js packages/nuget/Content/Scripts/knockback-core.min.js'
        'cp knockback-core-stack.js packages/nuget/Content/Scripts/knockback-core-stack.js'
        'cp knockback-core-stack.min.js packages/nuget/Content/Scripts/knockback-core-stack.min.js'

        # nuget: components
        'cp lib/knockback-defaults.js packages/nuget/Content/Scripts/lib/knockback-defaults.js'
        'cp lib/knockback-defaults.min.js packages/nuget/Content/Scripts/lib/knockback-defaults.min.js'
        'cp lib/knockback-formatting.js packages/nuget/Content/Scripts/lib/knockback-formatting.js'
        'cp lib/knockback-formatting.min.js packages/nuget/Content/Scripts/lib/knockback-formatting.min.js'
        'cp lib/knockback-localization.js packages/nuget/Content/Scripts/lib/knockback-localization.js'
        'cp lib/knockback-localization.min.js packages/nuget/Content/Scripts/lib/knockback-localization.min.js'
        'cp lib/knockback-triggering.js packages/nuget/Content/Scripts/lib/knockback-triggering.js'
        'cp lib/knockback-triggering.min.js packages/nuget/Content/Scripts/lib/knockback-triggering.min.js'
        'cp lib/knockback-validation.js packages/nuget/Content/Scripts/lib/knockback-validation.js'
        'cp lib/knockback-validation.min.js packages/nuget/Content/Scripts/lib/knockback-validation.min.js'
        'cp lib/knockback-statistics.js packages/nuget/Content/Scripts/lib/knockback-statistics.js'
        'cp lib/knockback-statistics.min.js packages/nuget/Content/Scripts/lib/knockback-statistics.min.js'
      ]

  tests:
    _build:
      output: 'build'
      directories: [
        'test/knockback-core'
        'test/knockback-utils'
        'test/knockback-memory-management'
        'test/knockback-observable'
        'test/knockback-view-model'
        'test/knockback-collection-observable'
        'test/knockback-inject'

        'test/backbone-modelref'
        'test/backbone-relational'

        'test/knockback-defaults'
        'test/knockback-formatting'
        'test/knockback-localization'
        'test/knockback-triggering'
        'test/knockback-validation'

        'test/deprecated'
      ]
      commands: [
        'mbundle test/packaging/bundle-config.coffee'
        'mbundle test/lodash/bundle-config.coffee'
        'mbundle test/full-stack/bundle-config.coffee'
      ]
    _test:
      command: 'phantomjs'
      runner: 'phantomjs-qunit-runner.js'
      files: '**/*.html'
      directories: [
        'test/knockback-core'
        'test/knockback-utils'
        'test/knockback-memory-management'
        'test/knockback-observable'
        'test/knockback-view-model'
        'test/knockback-collection-observable'
        'test/knockback-inject'

        'test/backbone-modelref'
        'test/backbone-relational'

        'test/knockback-defaults'
        'test/knockback-formatting'
        'test/knockback-localization'
        'test/knockback-triggering'
        'test/knockback-validation'

        'test/deprecated'
        'test/full-stack'
        'test/packaging'

        'test/lodash'
        'test/parse'
      ]