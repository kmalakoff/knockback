const path = require('path');

module.exports = {
  full: {
    output: './_temp/browserify/knockback.tests.js',
    files: ['./test/spec/core/**/*.tests.js', './test/spec/plugins/**/*.tests.js'],
    options: {
      shim: {
        knockback: { path: './knockback.js', exports: 'kb', depends: { underscore: '_', backbone: 'Backbone', knockout: 'ko' } },
      },
    },
  },

  core: {
    output: './_temp/browserify/knockback-core.tests.js',
    files: ['./test/spec/core/**/*.tests.js'],
    options: {
      shim: {
        knockback: { path: './knockback.js', exports: 'kb', depends: { underscore: '_', backbone: 'Backbone', knockout: 'ko' } },
      },
    },
  },
};
