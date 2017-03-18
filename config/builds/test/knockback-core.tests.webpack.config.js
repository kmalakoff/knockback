const path = require('path');
const _ = require('underscore');

module.exports = _.extend(_.clone(require('../../webpack/base-config')), {
  entry: {
    'knockback-core.tests': require('../../files').tests_core,
  },
});

module.exports.resolve.alias = {
  knockback: path.resolve('./knockback-core.js'),
};
