fs = require 'fs-extra'
path = require 'path'
_ = require 'underscore'
Queue = require 'queue-async'
{Server} = require 'karma'
gutil = require 'gulp-util'
generate = require './generate'

KARMA_CONFIG_BASE = require './config-base'
KARMA_CONFIG_AMD = require './config-amd'

module.exports = (options={}, callback) ->
  fs.removeSync('./_temp')
  fs.removeSync('node_modules/knockback')
  queue = new Queue(1)
  queue.defer (callback) -> generate(options, callback)

  TEST_GROUPS = require '../test_groups'
  TEST_GROUPS = {browser_globals: TEST_GROUPS.browser_globals.slice(0, 1)} if options.tags.indexOf('@quick') >= 0

  for name, tests of TEST_GROUPS then do (name, tests) -> 
    for test in tests then do (test) -> 
      # return unless test.name is 'amd_backbone_lodash_latest_browser_globals'

      queue.defer (callback) ->
        gutil.log "RUNNING TESTS: #{name} #{test.name}"
        gutil.log "#{JSON.stringify test.files}"
        karma_config = if (name == 'amd') then KARMA_CONFIG_AMD else KARMA_CONFIG_BASE
        args = if options.tags then ['--grep', options.tags] else []
        new Server(
          _.defaults({files: test.files, client: {args}}, karma_config),
          (return_value) ->
            console.log("DONE TESTS: #{name} #{test.name}. Return value: #{return_value}")
            callback(new Error "Tests failed: #{return_value}" if return_value)
        ).start()

  queue.await (err) ->
    fs.removeSync('./_temp') unless err
    callback(err)
