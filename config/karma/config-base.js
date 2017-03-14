module.exports = {
  basePath: '.',
  frameworks: ['mocha', 'chai'],

  reporters: ['dots'],
  port: 9876,
  colors: true,
  logLevel: 'INFO',
  browsers: ['PhantomJS'], // ['Firefox', 'Chrome', 'Safari']
  singleRun: true,
  // browsers: ['Chrome'],
  // singleRun: false,
};
