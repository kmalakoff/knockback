const fs = require('fs-extra');
const path = require('path');
const _ = require('underscore');
const Queue = require('queue-async');
const { Server } = require('karma');
const gutil = require('gulp-util');
const generate = require('./generate');

const KARMA_CONFIG_BASE = require('./config-base');
const KARMA_CONFIG_AMD = require('./config-amd');
const TEST_GROUPS = require('../test_groups');

module.exports = function (callback) {
  fs.removeSync('./_temp', true);
  fs.removeSync('node_modules/knockback', true);
  const queue = new Queue(1);
  queue.defer(callback => generate(callback));

  for (const name in TEST_GROUPS) {
    const tests = TEST_GROUPS[name]; ((name, tests) =>
    tests.map(test => (test =>
      queue.defer((callback) => {
        gutil.log(`RUNNING TESTS: ${name} ${test.name}`);
        gutil.log(`${JSON.stringify(test.files)}`);
        const karma_config = (name === 'amd') ? KARMA_CONFIG_AMD : KARMA_CONFIG_BASE;
        return new Server(
          _.defaults({ files: test.files }, karma_config),
          (return_value) => {
            console.log(`DONE TESTS: ${name} ${test.name}. Return value: ${return_value}`);
            return callback(return_value ? new Error(`Tests failed: ${return_value}`) : undefined);
          }).start();
      })
    )(test))
  )(name, tests);
  }

  return queue.await((err) => {
    if (!err) { fs.removeSync('./_temp', true); }
    return callback(err);
  });
};
