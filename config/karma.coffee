module.exports =
  basePath: '.'
  frameworks: ['mocha', 'chai']
  preprocessors: {'**/*.coffee': ['coffee']}

  coffeePreprocessor:
    options: {bare: true, sourceMap: false}
    transformPath: (path) -> path.replace(/\.coffee$/, '.js')

  reporters: ['progress']
  port: 9876
  colors: true
  logLevel: 'INFO'
  browsers: ['Chrome'] #'Firefox', 'Safari'],
