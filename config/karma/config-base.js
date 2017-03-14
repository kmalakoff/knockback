module.exports = {
  basePath: '.',
  frameworks: ['mocha', 'chai'],

  preprocessors: { 'test/spec/**/*.js': ['babel'] },
  babelPreprocessor: { options: { presets: ['es2015', 'stage-1'] } },

  reporters: ['dots'],
  port: 9876,
  colors: true,
  logLevel: 'INFO',
  browsers: ['PhantomJS'], // ['Firefox', 'Chrome', 'Safari']
  singleRun: true,
  // browsers: ['Chrome'],
  // singleRun: false,
};
