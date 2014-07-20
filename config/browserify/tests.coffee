module.exports =
  full:
    output: './_temp/browserify/knockback.tests.js'
    files: ['./test/spec/core/**/*.tests.coffee', './test/spec/plugins/**/*.tests.coffee']
    options:
      shim:
        knockback: {path: './knockback.js', exports: 'kb', depends: {jquery: 'jQuery', underscore: '_', backbone: 'Backbone', knockout: 'ko'}}

  core:
    output: './_temp/browserify/knockback-core.tests.js'
    files: ['./test/spec/core/**/*.tests.coffee']
    options:
      shim:
        knockback: {path: './knockback.js', exports: 'kb', depends: {jquery: 'jQuery', underscore: '_', backbone: 'Backbone', knockout: 'ko'}}
