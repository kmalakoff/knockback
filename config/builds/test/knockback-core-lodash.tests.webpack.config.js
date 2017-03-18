const path = require('path');
const _ = require('lodash');

module.exports = _.extend(_.clone(require('../../webpack/base-config')), {
  entry: {
    'knockback-core-lodash.tests': require('../../files').tests_core,
  },
});

module.exports.resolve.alias = {
  underscore: require.resolve('lodash'),
  knockback: path.resolve('./knockback-core.js'),
};
