fs = require 'fs-extra'
path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
{Server} = require 'karma'
gutil = require 'gulp-util'
generate = require './generate'

BASE_CONFIG = require './base-config'

module.exports = (options={}, callback) ->
  fs.removeSync('./_temp', true)
  fs.removeSync('node_modules/knockback', true)
  queue = new Queue(1)
  queue.defer (callback) -> generate(options, callback)

  TEST_GROUPS = require '../test_groups'
  TEST_GROUPS = {browser_globals: TEST_GROUPS.browser_globals.slice(0, 1)} if options.tags.indexOf('@quick') >= 0

  for name, tests of TEST_GROUPS
    for test in tests
      do (test) -> queue.defer (callback) ->
        gutil.log "RUNNING TESTS: #{test.name}"
        gutil.log "#{JSON.stringify test.files}"
        new Server(_.defaults({files: test.files, client: {args: ['--grep', options.tags or '']}}, BASE_CONFIG))
          .start((return_value) -> callback(new Error "Tests failed: #{return_value}" if return_value))

  queue.await (err) ->
    fs.removeSync('./_temp', true) unless err
    callback(err)
