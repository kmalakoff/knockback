module.exports =
  publishing:
    _build:
      commands: [
        # create docs
        # 'npm run docs' # disable until can get latest codo working

        # knockback dependencies
        'cp -v underscore vendor/underscore.js'
        'cp -v underscore/underscore-min.js vendor/underscore.min.js'
        'cp -v backbone vendor/backbone.js'
        'cp -v backbone/backbone-min.js vendor/backbone.min.js'
        'cp knockout/build/output/knockout-latest.debug.js vendor/knockout-3.1.0.js'
        'cp knockout/build/output/knockout-latest.js vendor/knockout-3.1.0.min.js'

        # knockback optional dependencies
        'cp -v lodash vendor/optional/lodash/lodash.js'
        'cp -v lodash/dist/lodash.min.js vendor/optional/lodash/lodash.min.js'
        'cp -v backbone-modelref vendor/optional/backbone-modelref/backbone-modelref.js'
        'cp -v backbone-modelref/backbone-modelref.min.js vendor/optional/backbone-modelref/backbone-modelref.min.js'
        'cp -v backbone-relational vendor/optional/backbone-relational/backbone-relational.js'
        'cp -v backbone-relational/backbone-relational.min.js vendor/optional/backbone-relational/backbone-relational.min.js'
        'cp -v backbone-associations vendor/optional/backbone-associations/backbone-associations.js'
        'cp -v supermodel vendor/optional/supermodel/supermodel.js'

        'cp -v backbone-orm/backbone-orm.js vendor/optional/backbone-orm/backbone-orm.js'
        'cp -v backbone-orm/backbone-orm.min.js vendor/optional/backbone-orm/backbone-orm.min.js'
        'cp -v moment vendor/optional/backbone-orm/moment.js'

        # knockback test dependencies
        # 'cp -v jquery.js vendor/test/jquery.js'
        # 'cp -v jqunitjs/qunit/qunit.js vendor/test/qunit.js'
        # 'cp -v jqunitjs/qunit/qunit.css vendor/test/qunit.css'

        # full and core stack
        'cat src/_license-header-full-stack.js vendor/underscore-1.6.0.js vendor/backbone-1.1.2.js vendor/knockout-3.1.0.js knockback.js > knockback-full-stack.js'
        'cat src/_license-header-full-stack.js vendor/underscore-1.6.0.min.js vendor/backbone-1.1.2.min.js vendor/knockout-3.1.0.min.js knockback.min.js > knockback-full-stack.min.js'
        'cat src/_license-header-core-stack.js vendor/underscore-1.6.0.js vendor/backbone-1.1.2.js vendor/knockout-3.1.0.js knockback-core.js > knockback-core-stack.js'
        'cat src/_license-header-core-stack.js vendor/underscore-1.6.0.min.js vendor/backbone-1.1.2.min.js vendor/knockout-3.1.0.min.js knockback-core.min.js > knockback-core-stack.min.js'

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
