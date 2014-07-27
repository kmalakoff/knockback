path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
Wrench = require 'wrench'
karma = require('karma').server
gutil = require 'gulp-util'
generate = require './generate'

BASE_CONFIG = require './base-config'

module.exports = (options={}, callback) ->
  Wrench.rmdirSyncRecursive('./_temp', true)
  Wrench.rmdirSyncRecursive('node_modules/knockback', true)
  queue = new Queue(1)
  queue.defer (callback) -> generate(options, callback)

  TEST_GROUPS = require '../test_groups'
  TEST_GROUPS = {browser_globals: TEST_GROUPS.browser_globals.slice(0, 1)} if options.tags.indexOf('@quick') >= 0

  for name, tests of TEST_GROUPS
    for test in tests
      do (test) -> queue.defer (callback) ->
        gutil.log "RUNNING TESTS: #{test.name}"
        gutil.log "#{JSON.stringify test.files}"
        karma.start _.defaults({files: test.files, client: {args: ['--grep', options.tags or '']}}, BASE_CONFIG), (return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value)

  queue.await (err) ->
    Wrench.rmdirSyncRecursive('./_temp', true) unless err
    callback(err)
