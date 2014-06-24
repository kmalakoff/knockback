module.exports = function(config) {
config.set({

  // base path that will be used to resolve all patterns (eg. files, exclude)
  basePath: '..',


  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ['mocha', 'chai'],


  // list of files / patterns to load in the browser
  files: [
    './vendor/test/jquery-1.7.2.js',
    './vendor/underscore-1.6.0.js',
    './vendor/backbone-1.1.2.js',
    './vendor/knockout-3.1.0.js',
    './knockback-core.js',
    './lib/knockback-statistics.js',
    'test_karma/**/*.coffee'
  ],


  // list of files to exclude
  exclude: [
  ],


  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    '**/*.coffee': ['coffee']
  },


  coffeePreprocessor: {
    // options passed to the coffee compiler
    options: {
      bare: true,
      sourceMap: false
    },
    // transforming the filenames
    transformPath: function(path) {
      return path.replace(/\.coffee$/, '.js');
    }
  },

  // test results reporter to use
  // possible values: 'dots', 'progress'
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ['progress'],


  // web server port
  port: 9876,


  // enable / disable colors in the output (reporters and logs)
  colors: true,


  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  logLevel: config.LOG_INFO,


  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: false,


  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  browsers: ['Chrome'], //'Firefox', 'Safari'],


  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: true
});
};
