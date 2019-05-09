module.exports = {
  full: {
    output: './_temp/browserify/knockback.tests.js',
    files: ['./test/knockback-core/**/*.tests.js', './test/plugins/**/*.tests.js'],
    options: {
      shim: {
        knockback: {
          path: './node_modules/@knockback/core/dist/knockback-core.js',
          exports: 'kb',
          depends: { underscore: '_', backbone: 'Backbone', knockout: 'ko' }
        }
      }
    }
  },

  core: {
    output: './_temp/browserify/knockback-core.tests.js',
    files: ['./test/knockback-core/**/*.tests.js'],
    options: {
      shim: {
        knockback: {
          path: './node_modules/@knockback/core/dist/knockback-core.js',
          exports: 'kb',
          depends: { underscore: '_', backbone: 'Backbone', knockout: 'ko' }
        }
      }
    }
  }
};
