module.exports =
  basePath: '.'
  frameworks: ['mocha', 'chai']
  preprocessors: {'**/*.coffee': ['coffee']}

  coffeePreprocessor:
    options: {bare: true, sourceMap: false}
    transformPath: (path) -> path.replace(/\.coffee$/, '.js')

  reporters: ['dots']
  port: 9876
  colors: true
  logLevel: 'INFO'
  browsers: ['Chrome'] # ['Firefox', 'Chrome', 'Safari']
  singleRun: false
