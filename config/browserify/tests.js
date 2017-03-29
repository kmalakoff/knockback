module.exports = {
  full: {
    output: './_temp/browserify/knockback.tests.js',
    files: ['./test/core/**/*.tests.js', './test/plugins/**/*.tests.js'],
    options: {
      shim: {
        knockback: { path: './knockback.js', exports: 'kb', depends: { underscore: '_', backbone: 'Backbone', knockout: 'ko' } },
      },
    },
  },

  core: {
    output: './_temp/browserify/knockback-core.tests.js',
    files: ['./test/core/**/*.tests.js'],
    options: {
      shim: {
        knockback: { path: './knockback.js', exports: 'kb', depends: { underscore: '_', backbone: 'Backbone', knockout: 'ko' } },
      },
    },
  },
};
