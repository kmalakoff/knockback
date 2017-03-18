module.exports = {
  basePath: '.',
  frameworks: ['mocha', 'chai'],

  preprocessors: { 'test/spec/**/*.js': ['babel'] },
  babelPreprocessor: { options: { presets: ['es2015', 'stage-1'] } },

  reporters: ['dots'],
  port: 9876,
  colors: true,
  logLevel: 'INFO',

  // customLaunchers: { 'PhantomJS_custom': { base: 'PhantomJS', debug: true } },
  // browsers: ['PhantomJS_custom'],
  // singleRun: false,

  browsers: ['PhantomJS'],
  singleRun: true,

  // browsers: ['Chrome', 'Firefox', 'Chrome', 'Safari'],
  // singleRun: true,

  // browsers: ['Chrome'],
  // singleRun: true,
};
