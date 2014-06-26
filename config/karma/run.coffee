_ = require 'underscore'
Queue = require 'queue-async'
karma = require('karma').server

STANDARD_CONFIG =
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
  browsers: ['PhantomJS'] #, 'Chrome', 'Firefox', 'Safari']

module.exports = (callback) ->
  queue = new Queue(1)
  for file_info in require('./files')
    do (file_info) -> queue.defer (callback) -> console.log "RUNNING TESTS: #{file_info.name}"; karma.start(_.defaults({singleRun: true, files: file_info.files}, STANDARD_CONFIG), (return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value) )
  queue.await callback
