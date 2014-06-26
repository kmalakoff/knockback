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

TEST_GROUPS = require('./test_groups')

module.exports = (callback) ->
  queue = new Queue(1)

  # STANDARD CONFIG
  for name, tests of TEST_GROUPS
    for test in tests
      do (test) -> queue.defer (callback) -> console.log "RUNNING TESTS: #{test.name}"; karma.start(_.defaults({singleRun: true, files: test.files}, STANDARD_CONFIG), (return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value) )

  # # AMD
  # for test in TEST_GROUPS.full
  #   do (test) -> queue.defer (callback) -> console.log "RUNNING TESTS: #{test.name}"; karma.start(_.defaults({singleRun: true, files: test.files}, STANDARD_CONFIG), (return_value) -> console.log "RETURN VALUE: #{return_value}"; callback(new Error "Tests failed: #{return_value}" if return_value) )

  queue.await callback
