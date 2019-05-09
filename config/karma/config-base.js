module.exports = {
  basePath: '.',
  frameworks: ['mocha', 'chai'],

  preprocessors: { 'test/**/*.js': ['babel'] },
  babelPreprocessor: { options: { presets: ['@babel/preset-env'] } },

  reporters: ['dots'],
  port: 9876,
  colors: true,
  logLevel: 'INFO',

  // browsers: ['ChromeHeadless'],
  // singleRun: true

  // browsers: ['Chrome', 'Firefox', 'Chrome', 'Safari'],
  // singleRun: true,

  browsers: ['Chrome'],
  singleRun: true
};
