path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../../webpack/base-config.coffee'), {
  entry: require('../../files').tests_core
}

module.exports.resolve.alias =
  underscore: path.resolve('./vendor/optional/lodash-2.4.1.js')
  knockback: path.resolve('./knockback-core.js')
