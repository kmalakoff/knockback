const path = require('path');
const _ = require('lodash');
const glob = require('glob');

const TEST_DIR = path.resolve(path.join(__dirname, '..', '..', '..', 'test', 'spec'));

module.exports = _.extend(_.clone(require('../../webpack/base-config')), {
  entry: {
    'knockback-core-lodash.tests': glob.sync('**/*.tests.js', { cwd: path.join(TEST_DIR, 'core'), absolute: true }),
  },
});

module.exports.resolve.alias = {
  underscore: require.resolve('lodash'),
  knockback: path.resolve('./knockback-core.js'),
};
