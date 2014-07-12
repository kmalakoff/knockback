module.exports =
  full:
    output: './_temp/browserify/knockback.tests.js'
    files: ['./test/spec/knockback/**/*.tests.coffee']
    options:
      shim:
        knockback: {path: './knockback.js', exports: 'kb', depends: {jquery: 'jQuery', underscore: '_', backbone: 'Backbone', knockout: 'ko'}}

  core:
    output: './_temp/browserify/knockback-core.tests.js'
    files: ['./test/spec/knockback/**/*.core.tests.coffee']
    options:
      shim:
        knockback: {path: './knockback.js', exports: 'kb', depends: {jquery: 'jQuery', underscore: '_', backbone: 'Backbone', knockout: 'ko'}}
