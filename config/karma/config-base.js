module.exports = {
  basePath: '.',
  frameworks: ['mocha', 'chai'],

  preprocessors: { 'test/**/*.js': ['babel'] },
  babelPreprocessor: { options: { presets: ['es2015', 'stage-1'] } },

  reporters: ['dots'],
  port: 9876,
  colors: true,
  logLevel: 'INFO',

  // customLaunchers: { 'ChromeHeadless_custom': { base: 'ChromeHeadless', flags: ['--remote-debugging-port=5858'] } },
  // browsers: ['ChromeHeadless_custom'],
  // singleRun: false,

  // browsers: ['Chrome'],
  // singleRun: false,

  browsers: ['ChromeHeadless'],
  singleRun: true

  // browsers: ['Chrome', 'Firefox', 'Chrome', 'Safari'],
  // singleRun: true,

  // browsers: ['Chrome'],
  // singleRun: true,
};
