path = require 'path'
_ = require 'underscore'

resolveModule = (module_name) -> require.resolve(module_name)

module.exports = _.extend  _.clone(require '../../webpack/base-config.coffee'), {
  entry: _.flatten([require('../../files').tests_core, require('../../files').tests_plugin])
}

module.exports.resolve.alias =
  underscore: resolveModule('lodash')
  knockback: path.resolve('./knockback.js')
