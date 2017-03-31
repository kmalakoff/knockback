const fs = require('fs-extra');
const _ = require('lodash');
const { Server } = require('karma');
const generate = require('./generate');

const KARMA_CONFIG_BASE = require('./config-base');
const KARMA_CONFIG_AMD = require('./config-amd');

const TEST_GROUPS = require('../test_groups');

module.exports = async () => {
  fs.removeSync('./_temp', true);
  // fs.removeSync('node_modules/knockback', true);

  try {
    await generate();

    for (const name in TEST_GROUPS) {
      if (Object.prototype.hasOwnProperty.call(TEST_GROUPS, name)) {
        for (const test of TEST_GROUPS[name]) {
          console.log(`RUNNING TESTS: ${name} ${test.name}`);
          console.log(`${JSON.stringify(test.files)}`);
          const karma_config = (name === 'amd') ? KARMA_CONFIG_AMD : KARMA_CONFIG_BASE;
          await new Promise((resolve, reject) => {
            new Server(
              _.defaults({ files: test.files }, karma_config),
              (result) => {
                console.log(`DONE TESTS: ${name} ${test.name}. Return value: ${result}`);
                result ? reject(new Error(`Tests failed: ${result}`)) : resolve();
              }).start();
          });
        }
      }
    }

    fs.removeSync('./_temp', true);
  } catch (err) { console.error(err); }
};
