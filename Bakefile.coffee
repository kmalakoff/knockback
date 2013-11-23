module.exports =
  library:
    join: 'knockback.js'
    wrapper: 'src/_module-loader-full.js'
    compress: true
    files: [
      'src/core/core.coffee'
      'src/ecosystem/binding.coffee'
      'src/ecosystem/utility.coffee'
      'src/ecosystem/model.coffee'
      'src/ecosystem/orm.coffee'
      'src/core/_internal.coffee'
      'src/core/utils.coffee'
      'src/core/factory.coffee'
      'src/core/store.coffee'
      'src/core/event-watcher.coffee'
      'src/core/observable.coffee'
      'src/core/view-model.coffee'
      'src/core/collection-observable.coffee'
      'src/core/inject.coffee'
      'src/defaults/default-observable.coffee'
      'src/defaults/extensions.coffee'
      'src/formatting/formatted-observable.coffee'
      'src/localization/localized-observable.coffee'
      'src/localization/extensions.coffee'
      'src/triggering/triggered-observable.coffee'
      'src/validation/validation.coffee'
      'src/validation/validators.coffee'
    ]

  knockback_core:
    join: 'knockback-core.js'
    wrapper: 'src/core/_module-loader.js'
    compress: true
    files: [
      'src/core/core.coffee'
      'src/ecosystem/binding.coffee'
      'src/ecosystem/utility.coffee'
      'src/ecosystem/model.coffee'
      'src/ecosystem/orm.coffee'
      'src/core/_internal.coffee'
      'src/core/utils.coffee'
      'src/core/factory.coffee'
      'src/core/store.coffee'
      'src/core/event-watcher.coffee'
      'src/core/observable.coffee'
      'src/core/view-model.coffee'
      'src/core/collection-observable.coffee'
      'src/core/inject.coffee'
    ]

  knockback_defaults:
    join: 'defaults.js'
    wrapper: 'src/defaults/_module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/defaults/default-observable.coffee'
      'src/defaults/extensions.coffee'
    ]

  knockback_formatting:
    join: 'formatting.js'
    wrapper: 'src/formatting/_module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/formatting/formatted-observable.coffee'
    ]

  knockback_localization:
    join: 'localization.js'
    wrapper: 'src/localization/_module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/localization/extensions.coffee'
      'src/localization/localized-observable.coffee'
    ]

  knockback_triggering:
    join: 'triggering.js'
    wrapper: 'src/triggering/_module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/triggering/triggered-observable.coffee'
    ]

  knockback_validation:
    join: 'validation.js'
    wrapper: 'src/validation/_module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/validation/validation.coffee'
      'src/validation/validators.coffee'
    ]

  knockback_statistics:
    join: 'statistics.js'
    wrapper: 'src/statistics/_module-loader.js'
    output: 'lib'
    compress: true
    files: [
      'src/component-imports.coffee'
      'src/statistics/statistics.coffee'
    ]

  test_localization_examples:
    join: '_localization_examples.js'
    wrapper: 'test/_examples/_module-loader.js'
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
        'npm run docs'

        # knockback dependencies
        'cp -v underscore vendor/underscore.js'
        'cp -v underscore/underscore-min.js vendor/underscore.min.js'
        'cp -v backbone vendor/backbone.js'
        'cp -v backbone/backbone-min.js vendor/backbone.min.js'
        'cp knockout/build/output/knockout-latest.debug.js vendor/knockout-3.0.0.js'
        'cp knockout/build/output/knockout-latest.js vendor/knockout-3.0.0.min.js'

        # knockback optional dependencies
        'cp -v lodash vendor/optional/lodash/lodash.js'
        'cp -v lodash/dist/lodash.min.js vendor/optional/lodash/lodash.min.js'
        'cp -v backbone-modelref vendor/optional/backbone-modelref/backbone-modelref.js'
        'cp -v backbone-modelref/backbone-modelref.min.js vendor/optional/backbone-modelref/backbone-modelref.min.js'
        'cp -v backbone-relational vendor/optional/backbone-relational/backbone-relational.js'
        'cp -v backbone-relational/backbone-relational.min.js vendor/optional/backbone-relational/backbone-relational.min.js'

        'cp -v backbone-orm/backbone-orm.js vendor/optional/backbone-orm/backbone-orm.js'
        'cp -v backbone-orm/backbone-orm.min.js vendor/optional/backbone-orm/backbone-orm.min.js'
        'cp -v moment vendor/optional/backbone-orm/moment.js'
        'cp -v inflection vendor/optional/backbone-orm/inflection.js'
        'cp -v lru-cache vendor/optional/backbone-orm/lru-cache.js'

        # knockback test dependencies
        # 'cp -v jquery.js vendor/test/jquery.js'
        # 'cp -v jqunitjs/qunit/qunit.js vendor/test/qunit.js'
        # 'cp -v jqunitjs/qunit/qunit.css vendor/test/qunit.css'

        # full and core stack
        'cat src/_license-header-full-stack.js vendor/underscore-1.5.2.js vendor/backbone-1.1.0.js vendor/knockout-3.0.0.js knockback.js > knockback-full-stack.js'
        'cat src/_license-header-full-stack.js vendor/underscore-1.5.2.min.js vendor/backbone-1.1.0.min.js vendor/knockout-3.0.0.min.js knockback.min.js > knockback-full-stack.min.js'
        'cat src/_license-header-core-stack.js vendor/underscore-1.5.2.js vendor/backbone-1.1.0.js vendor/knockout-3.0.0.js knockback-core.js > knockback-core-stack.js'
        'cat src/_license-header-core-stack.js vendor/underscore-1.5.2.min.js vendor/backbone-1.1.0.min.js vendor/knockout-3.0.0.min.js knockback-core.min.js > knockback-core-stack.min.js'

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
        'cp lib/defaults.js packages/npm/lib/defaults.js'
        'cp lib/defaults.min.js packages/npm/lib/defaults.min.js'
        'cp lib/formatting.js packages/npm/lib/formatting.js'
        'cp lib/formatting.min.js packages/npm/lib/formatting.min.js'
        'cp lib/localization.js packages/npm/lib/localization.js'
        'cp lib/localization.min.js packages/npm/lib/localization.min.js'
        'cp lib/triggering.js packages/npm/lib/triggering.js'
        'cp lib/triggering.min.js packages/npm/lib/triggering.min.js'
        'cp lib/validation.js packages/npm/lib/validation.js'
        'cp lib/validation.min.js packages/npm/lib/validation.min.js'
        'cp lib/statistics.js packages/npm/lib/statistics.js'
        'cp lib/statistics.min.js packages/npm/lib/statistics.min.js'

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
        'cp lib/defaults.js packages/nuget/Content/Scripts/lib/defaults.js'
        'cp lib/defaults.min.js packages/nuget/Content/Scripts/lib/defaults.min.js'
        'cp lib/formatting.js packages/nuget/Content/Scripts/lib/formatting.js'
        'cp lib/formatting.min.js packages/nuget/Content/Scripts/lib/formatting.min.js'
        'cp lib/localization.js packages/nuget/Content/Scripts/lib/localization.js'
        'cp lib/localization.min.js packages/nuget/Content/Scripts/lib/localization.min.js'
        'cp lib/triggering.js packages/nuget/Content/Scripts/lib/triggering.js'
        'cp lib/triggering.min.js packages/nuget/Content/Scripts/lib/triggering.min.js'
        'cp lib/validation.js packages/nuget/Content/Scripts/lib/validation.js'
        'cp lib/validation.min.js packages/nuget/Content/Scripts/lib/validation.min.js'
        'cp lib/statistics.js packages/nuget/Content/Scripts/lib/statistics.js'
        'cp lib/statistics.min.js packages/nuget/Content/Scripts/lib/statistics.min.js'
      ]

  tests:
    _build:
      output: 'build'
      directories: [
        'test/knockback/core'
        'test/knockback/utils'
        'test/knockback/memory-management'
        'test/knockback/observable'
        'test/knockback/view-model'
        'test/knockback/collection-observable'
        'test/knockback/inject'

        'test/knockback/defaults'
        'test/knockback/formatting'
        'test/knockback/localization'
        'test/knockback/triggering'
        'test/knockback/validation'

        'test/ecosystem/backbone-modelref'
        'test/ecosystem/backbone-orm'
        'test/ecosystem/backbone-relational'

        'test/module_systems/amd/observable'
        'test/module_systems/amd/defaults'
        'test/module_systems/amd/formatting'
        'test/module_systems/amd/localization'
        'test/module_systems/amd/triggering'
        'test/module_systems/amd/validation'
      ]
      commands: [
        'mbundle test/module_systems/commonjs/_bundle-config.coffee'
        'mbundle test/ecosystem/lodash/_bundle-config.coffee'
        'mbundle test/full-stack/_bundle-config.coffee'
      ]
    _test:
      command: 'phantomjs'
      runner: 'phantomjs-qunit-runner.js'
      files: '**/*.html'
      directories: [
        'test/knockback/core'
        'test/knockback/utils'
        'test/knockback/memory-management'
        'test/knockback/observable'
        'test/knockback/view-model'
        'test/knockback/collection-observable'
        'test/knockback/inject'

        'test/knockback/defaults'
        'test/knockback/formatting'
        'test/knockback/localization'
        'test/knockback/triggering'
        'test/knockback/validation'

        'test/ecosystem/backbone-modelref'
        'test/ecosystem/backbone-orm'
        'test/ecosystem/backbone-relational'
        'test/ecosystem/lodash'
        'test/ecosystem/parse'

        'test/module_systems/commonjs'
        'test/module_systems/amd/observable'
        'test/module_systems/amd/defaults'
        'test/module_systems/amd/formatting'
        'test/module_systems/amd/localization'
        'test/module_systems/amd/triggering'
        'test/module_systems/amd/validation'

        'test/full-stack'
      ]