const path = require('path');
const _ = require('lodash');

module.exports = _.extend(_.clone(require('../../webpack/base-config')), {
  entry: {
    'knockback-lodash.tests': _.flattenDeep([require('../../files').tests_core, require('../../files').tests_plugin]),
  },
});

module.exports.resolve.alias = {
  underscore: require.resolve('lodash'),
  knockback: path.resolve('./knockback.js'),
};
