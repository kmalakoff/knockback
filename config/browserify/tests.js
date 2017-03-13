const path = require('path');

module.exports = {
  full: {
    output: './_temp/browserify/knockback.tests.js',
    files: ['./test/spec/core/**/*.tests.coffee', './test/spec/plugins/**/*.tests.coffee'],
    options: {
      // basedir: path.resolve(__dirname, '../..')
      shim: {
        knockback: {path: './knockback.js', exports: 'kb', depends: {underscore: '_', backbone: 'Backbone', knockout: 'ko'}}
      }
    }
  },

  core: {
    output: './_temp/browserify/knockback-core.tests.js',
    files: ['./test/spec/core/**/*.tests.coffee'],
    options: {
      // basedir: path.resolve(__dirname, '../..')
      shim: {
        knockback: {path: './knockback.js', exports: 'kb', depends: {underscore: '_', backbone: 'Backbone', knockout: 'ko'}}
      }
    }
  }
};
