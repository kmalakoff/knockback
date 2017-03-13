const fs = require('fs-extra');
const path = require('path');
const _ = require('underscore');
const Queue = require('queue-async');
const {Server} = require('karma');
const gutil = require('gulp-util');
const generate = require('./generate');

const KARMA_CONFIG_BASE = require('./config-base');
const KARMA_CONFIG_AMD = require('./config-amd');

module.exports = function(options, callback) {
  if (options == null) { options = {}; }
  fs.removeSync('./_temp', true);
  fs.removeSync('node_modules/knockback', true);
  const queue = new Queue(1);
  queue.defer(callback => generate(options, callback));

  let TEST_GROUPS = require('../test_groups');
  if (options.tags.indexOf('@quick') >= 0) { TEST_GROUPS = {browser_globals: TEST_GROUPS.browser_globals.slice(0, 1)}; }

  for (let name in TEST_GROUPS) { const tests = TEST_GROUPS[name]; ((name, tests) => 
    tests.map((test) => (test => 
      // return unless test.name is 'amd_backbone_lodash_latest_browser_globals'

      queue.defer(function(callback) {
        gutil.log(`RUNNING TESTS: ${name} ${test.name}`);
        gutil.log(`${JSON.stringify(test.files)}`);
        const karma_config = (name === 'amd') ? KARMA_CONFIG_AMD : KARMA_CONFIG_BASE;
        const args = options.tags ? ['--grep', options.tags] : [];
        return new Server(
          _.defaults({files: test.files, client: {args}}, karma_config),
          function(return_value) {
            console.log(`DONE TESTS: ${name} ${test.name}. Return value: ${return_value}`);
            return callback(return_value ? new Error(`Tests failed: ${return_value}`) : undefined);
        }).start();
      })
    )(test))
  )(name, tests); }

  return queue.await(function(err) {
    if (!err) { fs.removeSync('./_temp', true); }
    return callback(err);
  });
};
