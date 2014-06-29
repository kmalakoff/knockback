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

TEST_GROUPS = require('./test_groups')

module.exports = (callback) ->
  queue = new Queue(1)

  # generate the libraries
  queue.defer (callback) -> generate(callback)

  # STANDARD CONFIG
  for name, tests of TEST_GROUPS
    for test in tests
      do (test) -> queue.defer (callback) -> console.log "RUNNING TESTS: #{test.name}"; karma.start(_.defaults({singleRun: true, files: test.files}, STANDARD_CONFIG), (return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value) )

  # AMD
  # TODO: troubleshoot defaults not including knockback
  # for test in TEST_GROUPS.core when (test.name.indexOf('simple_') < 0) and (test.name.indexOf('defaults_') < 0) and (test.name.indexOf('_min') < 0)
  #   do (test) ->
  #     files = []
  #     files.push({pattern: file}) for file in ['./vendor/test/require-2.1.9.js']
  #     files.push({pattern: file, included: false}) for file in test.files.slice(0, -1)
  #     files.push({pattern: file}) for file in ["./_temp/#{gutil.replaceExtension(path.basename(test.files.slice(-1)[0]), '.js')}"]
  #     queue.defer (callback) -> console.log "RUNNING TESTS: #{test.name} (AMD)"; karma.start(_.defaults({singleRun: true, files: files}, STANDARD_CONFIG), (return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value) )

  # # webpack
  # for test in [{name: 'webpack', files: ['_temp/webpack-core.tests.js']}]
  #   do (test) -> queue.defer (callback) -> console.log "RUNNING TESTS: #{test.name}"; karma.start(_.defaults({singleRun: true, files: test.files}, STANDARD_CONFIG), (return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value) )

  queue.await (err) ->
    # Wrench.rmdirSyncRecursive('./_temp', true)
    callback(err)
