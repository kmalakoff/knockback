module.exports = {
  basePath: '.',
  frameworks: ['mocha', 'chai'],

  coffeePreprocessor: {
    options: {bare: true, sourceMap: false},
    transformPath(path) { return path.replace(/\.coffee$/, '.js'); }
  },

  reporters: ['dots'],
  port: 9876,
  colors: true,
  logLevel: 'INFO',
  browsers: ['PhantomJS'], // ['Firefox', 'Chrome', 'Safari']
  singleRun: true
  // browsers: ['Chrome']
  // singleRun: false
};
