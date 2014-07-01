module.exports =
  full:
    output: './_temp/browserify/knockback.tests.js'
    files: ['./test/knockback/**/*.tests.coffee']
    options:
      shim:
        knockback: {path: './knockback.js', exports: 'kb', depends: {jquery: 'jQuery', underscore: '_', backbone: 'Backbone', knockout: 'ko'}}
        'knockback-examples-localization': {path: './_temp/knockback-examples-localization.js', exports: 'kbel', depends: {knockback: 'kb'}}
  core:
    output: './_temp/browserify/knockback-core.tests.js'
    files: ['./test/knockback/**/*.core.tests.coffee']
    options:
      shim:
        knockback: {path: './knockback.js', exports: 'kb', depends: {jquery: 'jQuery', underscore: '_', backbone: 'Backbone', knockout: 'ko'}}
