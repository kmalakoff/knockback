path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
Wrench = require 'wrench'
karma = require('karma').server
gutil = require 'gulp-util'
generate = require './generate'

TEST_GROUPS = require '../test_groups'
BASE_CONFIG = require './base-config'

module.exports = (callback) ->
  queue = new Queue(1)

  queue.defer (callback) -> generate(callback)

  for name, tests of TEST_GROUPS
    for test in tests
      do (test) -> queue.defer (callback) -> gutil.log "RUNNING TESTS: #{test.name}"; karma.start(_.defaults({files: test.files}, BASE_CONFIG), (return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value) )

  queue.await (err) ->
    Wrench.rmdirSyncRecursive('./_temp', true)
    callback(err)
