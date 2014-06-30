path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
Wrench = require 'wrench'
karma = require('karma').server
gutil = require 'gulp-util'
generate = require './generate'

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
  browsers: ['PhantomJS']

TEST_GROUPS = require('../test_groups')

module.exports = (callback) ->
  queue = new Queue(1)

  queue.defer (callback) -> generate(callback)

  for name, tests of TEST_GROUPS
    for test in tests
      do (test) -> queue.defer (callback) -> gutil.log "RUNNING TESTS: #{test.name}"; karma.start(_.defaults({singleRun: true, files: test.files}, STANDARD_CONFIG), (return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value) )

  queue.await (err) ->
    Wrench.rmdirSyncRecursive('./_temp', true)
    callback(err)
